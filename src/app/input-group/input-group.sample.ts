import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {
    IgxInputGroupType,
    ButtonGroupAlignment,
    DisplayDensityToken,
    IDisplayDensityOptions,
    IButtonGroupEventArgs,
    IGX_INPUT_GROUP_TYPE,
    DisplayDensity
} from 'igniteui-angular';

interface Selection {
    selected: boolean;
    type?: IgxInputGroupType;
    label: string | DisplayDensity;
    togglable: boolean;
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app-input-group-sample',
    styleUrls: ['input-group.sample.scss'],
    templateUrl: 'input-group.sample.html',
    providers: [{provide: IGX_INPUT_GROUP_TYPE, useValue: 'box' }]
})
export class InputGroupSampleComponent implements OnInit, AfterViewInit {
    public inputValue: any;
    public isRequired = true;
    public isDisabled = false;
    public alignment: ButtonGroupAlignment = ButtonGroupAlignment.vertical;
    public density: DisplayDensity = 'comfortable';
    public displayDensities: Selection[];
    public inputType: IgxInputGroupType = null;
    public inputTypes: Selection[];
    public items: string[] = ['Orange', 'Apple', 'Banana', 'Mango'];

    public myForm = this.fb.group({
      myTextField: [],
      myTextField2: ['', Validators.required],
      mySelectField: []
    });
    public date = new Date();

    public genres = [];
    public minTime = '06:15:30';
    public maxTime = '09:15:30';
    public minDate = new Date();
    public maxDate = new Date(new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate() + 14));

    public form = new FormGroup({
        input1: new FormControl(null, Validators.maxLength(20)),
        input2: new FormControl(null),
        movie: new FormControl(null),
        fullName: new FormControl(null),
        phone: new FormControl(null),
        email: new FormControl(null),
        genres: new FormControl(null),
        genresSimple: new FormControl(null),
        date: new FormControl(null),
        time: new FormControl(null),
    });
    
    public setInvalid() {
        this.form.markAllAsTouched();
        this.form.get('input1').setErrors({ error: true });
        this.form.get('input2').setErrors({ error: true });
        this.form.get('movie').setErrors({ error: true });
        this.form.get('fullName').setErrors({ error: true });
        this.form.get('phone').setErrors({ error: true });
        this.form.get('email').setErrors({ error: true });
        this.form.get('genres').setErrors({ error: true });
        this.form.get('genresSimple').setErrors({ error: true });
        this.form.get('date').setErrors({ error: true });
        this.form.get('time').setErrors({ error: true });
    }

    public reset(){
        this.form.get('input1').reset();
        this.form.get('input2').reset();
        this.form.get('movie').reset();
        this.form.get('fullName').reset();
        this.form.get('phone').reset();
        this.form.get('email').reset();
        this.form.get('genres').reset();
        this.form.get('genresSimple').reset();
        this.form.get('date').reset();
        this.form.get('time').reset();
    }

    constructor(
        @Inject(DisplayDensityToken)
        public displayDensityOptions: IDisplayDensityOptions,
        private fb: UntypedFormBuilder,
        @Inject(IGX_INPUT_GROUP_TYPE) public TOKEN: IgxInputGroupType
    ) {
        this.myForm.disable();
    }

    public ngOnInit(): void {
        this.displayDensities = [
            {
                label: 'comfortable',
                selected: this.density === 'comfortable',
                togglable: true,
            },
            {
                label: 'cosy',
                selected: this.density === 'cosy',
                togglable: true,
            },
            {
                label: 'compact',
                selected: this.density === 'compact',
                togglable: true,
            },
        ];

        this.inputTypes = [
            { selected: true, type: 'line', label: 'Line', togglable: true },
            {
                selected: this.inputType === 'border',
                type: 'border',
                label: 'Border',
                togglable: true,
            },
            {
                selected: this.inputType === 'box',
                type: 'box',
                label: 'Box',
                togglable: true,
            },
        ];

        this.genres = [
            { type: 'Action', movies: ['The Matrix', 'Kill Bill: Vol.1', 'The Dark Knight Rises'] },
            { type: 'Adventure', movies: ['Interstellar', 'Inglourious Basterds', 'Inception'] },
            {
                type: 'Comedy', movies: ['Wild Tales', 'In Bruges', 'Three Billboards Outside Ebbing, Missouri',
                    'Untouchable', '3 idiots']
            },
            { type: 'Crime', movies: ['Training Day', 'Heat', 'American Gangster'] },
            { type: 'Drama', movies: ['Fight Club', 'A Beautiful Mind', 'Good Will Hunting', 'City of God'] },
            { type: 'Biography', movies: ['Amadeus', 'Bohemian Rhapsody'] },
            { type: 'Mystery', movies: ['The Prestige', 'Memento', 'Cloud Atlas'] },
            { type: 'Musical', movies: ['All That Jazz'] },
            { type: 'Romance', movies: ['Love Actually', 'In The Mood for Love'] },
            { type: 'Sci-Fi', movies: ['The Fifth Element'] },
            { type: 'Thriller', movies: ['The Usual Suspects'] },
            { type: 'Western', movies: ['Django Unchained'] }
        ];
    }

    public ngAfterViewInit() {
        console.log(`The InputGroupToken set for all material themed components
            (that have no explicit type set on component OR sample lv) is: `,
        this.TOKEN);
    }

    public selectDensity(event: IButtonGroupEventArgs) {
        this.density = this.displayDensities[event.index].label as DisplayDensity;
    }

    public selectInputType(event: IButtonGroupEventArgs) {
        const currentType = this.inputTypes[event.index].type;
        this.inputType = currentType;
        console.log('New type set is = ', currentType);
    }

    public enableText() {
      this.myForm.get('myTextField').enable();
      this.myForm.get('myTextField2').enable();
    }

    public disableText() {
      this.myForm.get('myTextField').disable();
      this.myForm.get('myTextField2').disable();
    }

    public enableSelect() {
      this.myForm.get('mySelectField').enable();
    }

    public disableSelect() {
      this.myForm.get('mySelectField').disable();
    }

    public enableForm() {
      this.myForm.enable();
    }

    public disableForm() {
      this.myForm.disable();
    }
}
