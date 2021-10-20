import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    forwardRef,
    OnChanges,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { IgxPivotGridComponent } from './pivot-grid.component';
import { IgxRowDirective } from '../row.directive';
import { GridBaseAPIService, IgxColumnComponent } from '../hierarchical-grid/public_api';
import { IgxGridSelectionService } from '../selection/selection.service';
import { IPivotDimension } from './pivot-grid.interface';
import { PivotUtil } from './pivot-util';


const MINIMUM_COLUMN_WIDTH = 200;
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'igx-pivot-row',
    templateUrl: './pivot-row.component.html',
    providers: [{ provide: IgxRowDirective, useExisting: forwardRef(() => IgxPivotRowComponent) }]
})
export class IgxPivotRowComponent extends IgxRowDirective<IgxPivotGridComponent> implements OnChanges {

    /**
     * @hidden @internal
     */
     @ViewChild('headerTemplate', { read: TemplateRef, static: true })
     public headerTemplate: TemplateRef<any>;

    /**
     * @hidden @internal
     */
     @ViewChild('headerTemplateGray', { read: TemplateRef, static: true })
     public headerTemplateGray: TemplateRef<any>;

    public rowDimension: IgxColumnComponent[] = [];
    public level = 0;
    public hasChild = false;
    public currLvl = 0;

    constructor(
        public gridAPI: GridBaseAPIService<IgxPivotGridComponent>,
        public selectionService: IgxGridSelectionService,
        public element: ElementRef<HTMLElement>,
        public cdr: ChangeDetectorRef,
        protected resolver: ComponentFactoryResolver,
        protected viewRef: ViewContainerRef
    ){
        super(gridAPI, selectionService, element, cdr);
    }
    /**
     * @hidden
     * @internal
     */
     public get viewIndex(): number {
        return this.index;
    }

    /**
     * @hidden
     * @internal
     */
    public getRowDimensionKey(col: IgxColumnComponent) {
            const key =  PivotUtil.getRecordKey(this.rowData, this.rowData[col.field]) ;
            return key;
    }

    public getExpandState(col: IgxColumnComponent) {
        return this.grid.gridAPI.get_row_expansion_state(this.getRowDimensionKey(col));
    }


    /**
     * @hidden
     * @internal
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.rowData) {
            // generate new rowDimension on row data change
            this.rowDimension = [];
            const rowDimConfig = this.grid.pivotConfiguration.rows;
            this.level = this.rowData['level'] || 0;
            this.hasChild = this.rowData['records'] != null && this.rowData['records'].length > 0;
            this.currLvl = 0;
            this.extractFromDimensions(rowDimConfig, 0);
        }
    }

    public getCellClass(col: any) {
        const colName = col.field.split('-');
        const measureName = colName[colName.length - 1];
        return this.grid.pivotConfiguration.values.find(v => v.member === measureName)?.styles;
    }

    protected extractFromDimensions(rowDimConfig: IPivotDimension[], level: number) {
        let dimIndex = 0;
        this.currLvl += level;
        let currentLvl = level;
        for (const dim of rowDimConfig) {
            const fieldName = PivotUtil.resolveFieldName(dim, this.rowData);
            const fieldLevel = fieldName + '_level';
            currentLvl = this.rowData[fieldLevel] !== undefined ? this.rowData[fieldLevel] : currentLvl + 1;
            if (currentLvl === level) {
                this.rowDimension.push(this.extractFromDimension(dim, dimIndex, this.currLvl));
            }
            dimIndex++;
            if  (level < currentLvl) {
                this.extractFromDimensions(dim.childLevels, level + 1);
            }
        }
    }

    protected extractFromDimension(dim: IPivotDimension, index: number = 0, lvl = 0) {
        const field = PivotUtil.resolveFieldName(dim, this.rowData);
        let header = null;
        if (typeof dim.member === 'string') {
            header = this.rowData[dim.member];
        } else if (typeof dim.member === 'function'){
            header = dim.member.call(this, this.rowData);
        }
        const col = this._createColComponent(field, header, index, dim, lvl);
        return col;
    }

    protected _createColComponent(field: string, header: string, index: number = 0, dim: IPivotDimension, lvl = 0) {
        // const fieldName = field.indexOf('-') !==  -1 ? field.slice(field.lastIndexOf('-') + 1) : field;
        const factoryColumn = this.resolver.resolveComponentFactory(IgxColumnComponent);
        const ref = this.viewRef.createComponent(factoryColumn, null, this.viewRef.injector);
        ref.instance.field = field;
        ref.instance.header = header;
        ref.instance.width = MINIMUM_COLUMN_WIDTH + 'px';
        (ref as any).instance._vIndex = this.grid.columns.length + index + this.index * this.grid.pivotConfiguration.rows.length;
        if (dim.childLevels && dim.childLevels.length > 0 && this.hasChild && lvl >= PivotUtil.getTotalLvl(this.rowData)) {
            ref.instance.headerTemplate = this.headerTemplate;
        } else if (lvl < PivotUtil.getTotalLvl(this.rowData)) {
            ref.instance.headerTemplate = this.headerTemplateGray;
        }
        return ref.instance;
    }
}