import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    DoCheck,
    ElementRef,
    forwardRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import { take } from "rxjs/operators";
import { IgxSelectionAPIService } from "../core/selection";
import { IgxForOfDirective } from "../directives/for-of/for_of.directive";
import { IgxGridAPIService } from "./api.service";
import { IgxGridCellComponent } from "./cell.component";
import { IgxColumnComponent } from "./column.component";
import { autoWire, IGridBus } from "./grid.common";
import { IgxGridComponent, IRowSelectionEventArgs } from "./grid.component";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    selector: "igx-grid-row",
    templateUrl: "./row.component.html"
})
export class IgxGridRowComponent implements IGridBus, OnInit, OnDestroy, DoCheck {

    @Input()
    public rowData: any;

    @Input()
    public index: number;

    @Input()
    public gridID: string;

    @ViewChild("igxDirRef", { read: IgxForOfDirective })
    public virtDirRow: IgxForOfDirective<any>;

    @ViewChildren(forwardRef(() => IgxGridCellComponent), { read: IgxGridCellComponent })
    public cells: QueryList<IgxGridCellComponent>;

    @HostBinding("style.height.px")
    get rowHeight() {
        return this.grid.rowHeight;
    }
    @HostBinding("attr.tabindex")
    public tabindex = 0;

    @HostBinding("attr.role")
    public role = "row";

    @HostBinding("class")
    get styleClasses(): string {
        return `${this.defaultCssClass} ${this.index % 2 ? this.grid.evenRowCSS : this.grid.oddRowCSS}`;
    }

    @HostBinding("attr.aria-selected")
    @HostBinding("class.igx-grid__tr--selected")
    get focused(): boolean {
        return this.isFocused;
    }

    set focused(val: boolean) {
        this.isFocused = val;
    }

    get columns(): IgxColumnComponent[] {
        return this.grid.visibleColumns;
    }

    get pinnedColumns(): IgxColumnComponent[] {
        return this.grid.pinnedColumns;
    }

    get unpinnedColumns(): IgxColumnComponent[] {
        return this.grid.unpinnedColumns;
    }

    public get rowSelectable() {
        return this.grid.rowSelectable;
    }

    @HostBinding("attr.aria-selected")
    @HostBinding("class.igx-grid__tr--selected")
    public isSelected: boolean;

    get grid(): IgxGridComponent {
        return this.gridAPI.get(this.gridID);
    }

    public get rowID() {
        // A row in the grid is identified either by:
        // primaryKey data value,
        // or if the primaryKey is omitted, then the whole rowData is used instead.
        const primaryKey = this.grid.primaryKey;
        return primaryKey ? this.rowData[primaryKey] : this.rowData;
    }

    get nativeElement() {
        return this.element.nativeElement;
    }

    protected defaultCssClass = "igx-grid__tr";
    protected _rowSelection = false;
    protected isFocused = false;
    protected chunkLoaded$;

    constructor(public gridAPI: IgxGridAPIService,
                private selectionAPI: IgxSelectionAPIService,
                private element: ElementRef,
                public cdr: ChangeDetectorRef) { }

    @autoWire(true)
    public ngOnInit() {
        this.chunkLoaded$ = this.virtDirRow.onChunkLoad.subscribe(() => {
            if (this.grid.cellInEditMode) {
                this.grid.cellInEditMode.inEditMode = false;
            }
        });
    }

    public ngOnDestroy() {
        if (this.chunkLoaded$) {
            this.chunkLoaded$.unsubscribe();
        }
    }

    @HostListener("focus", ["$event"])
    public onFocus(event) {
        this.isFocused = true;
    }

    @HostListener("blur", ["$event"])
    public onBlur(event) {
        this.isFocused = false;
    }

    public onCheckboxClick(event) {
        const newSelection = (event.checked) ?
                            this.selectionAPI.select_item(this.gridID, this.rowID) :
                            this.selectionAPI.deselect_item(this.gridID, this.rowID);
        this.grid.triggerRowSelectionChange(newSelection, this, event);
    }

    get rowCheckboxAriaLabel() {
        return this.grid.primaryKey ? "Select row with key " + this.rowID : "Select row";
    }

    public ngDoCheck() {
        if (this.rowSelectable) {
            this.isSelected = this.grid.allRowsSelected ? true : this.selectionAPI.is_item_selected(this.gridID, this.rowID);
            this.cdr.markForCheck();
        } else {
            this.isSelected = this.selectionAPI.is_item_selected(this.gridID, this.rowID);
        }
    }

    public handleArrows(event) {
        let currentIndex = 0;
        let target;
        let eventCode = event.keyCode ? event.keyCode : event.which;
        const eventKey = event.key ? event.key.toLowerCase() : "";
        if (eventKey !== undefined && !eventCode) {
            eventCode = eventKey;
        }
        switch (eventCode) {
            case (39): // rightArrow
            case ("arrowright"):
                event.preventDefault();
                this.cells.first.nativeElement.focus();
                break;
            case (38): // upArrow
            case ("arrowup"):
                event.preventDefault();
                currentIndex = this.grid.rowList.toArray().indexOf(this);
                if (currentIndex === 0) {
                    const verticalScroll = this.grid.verticalScrollContainer.getVerticalScroll();
                    if (!verticalScroll) {
                        return;
                    }
                    this.grid.verticalScrollContainer.onChunkLoad.pipe(take(1)).subscribe({
                        next: (e: any) => {
                            target = this.grid.rowList.toArray()[currentIndex - 1];
                            if (target) {
                                this.grid.getRowByIndex(currentIndex - 1).nativeElement.querySelector(".igx-checkbox__input").focus();
                                this.cdr.detectChanges();
                            }
                        }
                    });
                    verticalScroll.scrollTop -= this.rowHeight;
                } else {
                    this.grid.getRowByIndex(this.index - 1).nativeElement.querySelector(".igx-checkbox__input").focus();
                }
                break;
            case (40): // downArrow
            case ("arrowdown"):
                event.preventDefault();
                currentIndex = this.grid.rowList.toArray().indexOf(this);
                if (currentIndex >= this.grid.rowList.length - 1) {
                    const verticalScroll = this.grid.verticalScrollContainer.getVerticalScroll();
                    if (!verticalScroll) {
                        return;
                    }
                    this.grid.verticalScrollContainer.onChunkLoad.pipe(take(1)).subscribe({
                        next: (e: any) => {
                            target = this.grid.rowList.toArray()[currentIndex + 1];
                            if (target) {
                                target.nativeElement.querySelector(".igx-checkbox__input").focus();
                                target.cdr.detectChanges();
                            }
                        }
                    });
                    verticalScroll.scrollTop += this.rowHeight;
                } else {
                    console.log(this.grid.getRowByIndex(this.index + 1).nativeElement.querySelector(".igx-checkbox__input"));
                    this.grid.getRowByIndex(this.index + 1).nativeElement.querySelector(".igx-checkbox__input").focus();
                }
                break;
            default:
        }
    }
}
