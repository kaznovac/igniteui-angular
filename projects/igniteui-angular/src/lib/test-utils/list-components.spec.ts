import { Component, ViewChild } from '@angular/core';
import { IgxListComponent } from '../list/public_api';
import { IgxForOfDirective } from '../directives/for-of/for_of.directive';

@Component({
    template: `
       <div class="ig-typography">
           <igx-list>
               <igx-list-item>
                   <igx-icon igxListThumbnail>face</igx-icon>
                   <span class="text-line" igxListLine>Text-Line</span>
                   <h1 igxListLineTitle class="custom">Title</h1>
                   <p igxListLineSubTitle class="custom">Subtitle</p>
                   <igx-icon igxListAction class="action-icon">share</igx-icon>
               </igx-list-item>
           </igx-list>
       </div>
    `
})

export class ListDirectivesComponent {
}

@Component({
    template: `
        <div #wrapper>
            <igx-list>
                <igx-list-item>Item 1</igx-list-item>
                <igx-list-item>Item 2</igx-list-item>
                <igx-list-item>Item 3</igx-list-item>
            </igx-list>
        </div>`
})
export class BasicListComponent {
    @ViewChild(IgxListComponent, { static: true }) public list: IgxListComponent;
    @ViewChild('wrapper', { static: true }) public wrapper;
}

@Component({
    template: `
        <div #wrapper>
            <igx-list>
                <igx-list-item [isHeader]="true">Header</igx-list-item>
                <igx-list-item>Item 1</igx-list-item>
                <igx-list-item>Item 2</igx-list-item>
                <igx-list-item>Item 3</igx-list-item>
            </igx-list>
        </div>`
})
export class ListWithHeaderComponent extends BasicListComponent {
}

@Component({
    template: `
        <div #wrapper>
            <igx-list [allowRightPanning]="allowRightPanning" [allowLeftPanning]="allowLeftPanning">
                <igx-list-item>Item 1</igx-list-item>
                <igx-list-item>Item 2</igx-list-item>
                <igx-list-item>Item 3</igx-list-item>
            </igx-list>
        </div>`
})
export class ListWithPanningComponent extends BasicListComponent {
    public allowRightPanning = true;
    public allowLeftPanning = true;
}

@Component({
    template: `
        <div #wrapper>
            <igx-list>
            </igx-list>
        </div>`
})
export class EmptyListComponent extends BasicListComponent {
}

@Component({
    template: `
        <div #wrapper>
            <igx-list>
                <ng-template igxEmptyList>
                    <h3>Custom no items message.</h3>
                </ng-template>
            </igx-list>
        </div>`
})
export class CustomEmptyListComponent extends BasicListComponent {
}

@Component({
    template: `
        <div #wrapper>
            <igx-list [isLoading]="isLoading">
            </igx-list>
        </div>`
})
export class ListLoadingComponent extends BasicListComponent {
    public isLoading = true;
}

@Component({
    template: `
        <div #wrapper>
            <igx-list [isLoading]="isLoading">
                <ng-template igxDataLoading>
                    <h3>Loading data...</h3>
                </ng-template>
            </igx-list>
        </div>`
})
export class ListCustomLoadingComponent extends ListLoadingComponent {
}

@Component({
    template: `
        <div #wrapper>
            <igx-list [allowRightPanning]="allowRightPanning" [allowLeftPanning]="allowLeftPanning">
                <igx-list-item [isHeader]="true">Header 1</igx-list-item>
                <igx-list-item [isHeader]="false" [hidden]="false">Item 1</igx-list-item>
                <igx-list-item [isHeader]="true">Header 2</igx-list-item>
                <igx-list-item [hidden]="true">Item 2</igx-list-item>
                <igx-list-item>Item 3</igx-list-item>
            </igx-list>
        </div>`
})
export class TwoHeadersListComponent extends ListWithPanningComponent {
}

@Component({
    template: `
        <div #wrapper>
            <igx-list [allowRightPanning]="false" [allowLeftPanning]="false">
                <igx-list-item [isHeader]="true">Header 1</igx-list-item>
                <igx-list-item [isHeader]="false" [hidden]="false">Item 1</igx-list-item>
                <igx-list-item [isHeader]="true">Header 2</igx-list-item>
                <igx-list-item [hidden]="true">Item 2</igx-list-item>
                <igx-list-item>Item 3</igx-list-item>
            </igx-list>
        </div>`
})
export class TwoHeadersListNoPanningComponent extends ListWithHeaderComponent {
}

@Component({
    template: `
        <div #wrapper>
            <igx-list [allowRightPanning]="allowRightPanning" [allowLeftPanning]="allowLeftPanning">
                <ng-template igxListItemLeftPanning>
                    <div>Left</div>
                </ng-template>
                <ng-template igxListItemRightPanning>
                    <div>Right</div>
                </ng-template>
                <igx-list-item [isHeader]="true">Header</igx-list-item>
                <igx-list-item>Item 1</igx-list-item>
                <igx-list-item>Item 2</igx-list-item>
                <igx-list-item>Item 3</igx-list-item>
            </igx-list>
        </div>`
})
export class ListWithPanningTemplatesComponent extends ListWithPanningComponent {
}

@Component({
    template: `
        <igx-list #forOfList>
            <div [style.height]="'240px'" [style.overflow]="'hidden'" [style.position]="'relative'">
                <igx-list-item
                    [index]="i"
                    *igxFor="let item of data; index as i; scrollOrientation : 'vertical'; containerSize: '240px'; itemSize: '40px'">
                    <div class="item-container">
                        <span>{{ item.key }}</span>&nbsp;
                        <span>{{ item.name }}</span>
                    </div>
                </igx-list-item>
            </div>
        </igx-list>`,
    styles: [`.item-container {
        display: flex;
    }`]
})
export class ListWithIgxForAndScrollingComponent {
    @ViewChild('forOfList', {read: IgxListComponent, static: true })
    public forOfList: IgxListComponent;

    @ViewChild(IgxForOfDirective)
    public igxFor: IgxForOfDirective<any>;

    public data = [
        {key: 1, name: 'John'},
        {key: 2, name: 'Brian'},
        {key: 3, name: 'Christian'},
        {key: 4, name: 'Mark'},
        {key: 5, name: 'William'},
        {key: 6, name: 'Dave'},
        {key: 7, name: 'Riley'},
        {key: 8, name: 'Terrance'},
        {key: 9, name: 'Erick'},
        {key: 10, name: 'Victor'},
        {key: 11, name: 'Rick'},
        {key: 12, name: 'Stefan'}
    ];
}
