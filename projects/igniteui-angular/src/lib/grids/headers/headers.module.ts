import { NgModule } from '@angular/core';
import { IgxGridHeaderComponent } from './grid-header.component';
import { IgxGridHeaderGroupComponent } from './grid-header-group.component';
import { IgxGridSharedModules } from '../common/shared.module';
import { IgxColumnMovingModule } from '../moving/moving.module';
import { IgxGridFilteringModule } from '../filtering/base/filtering.module';
import { IgxGridResizingModule } from '../resizing/resize.module';
import { SortingIndexPipe } from './sorting-index.pipe';
export * from './grid-header-group.component';
export * from './grid-header.component';

@NgModule({
    declarations: [
        IgxGridHeaderComponent,
        IgxGridHeaderGroupComponent,
        SortingIndexPipe
    ],
    imports: [
        IgxGridSharedModules,
        IgxGridFilteringModule,
        IgxColumnMovingModule,
        IgxGridResizingModule
    ],
    exports: [
        IgxGridHeaderComponent,
        IgxGridHeaderGroupComponent
    ]
})
export class IgxGridHeadersModule {}
