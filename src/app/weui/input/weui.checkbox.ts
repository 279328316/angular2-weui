/**
 * @license
 * Copyright 厦门乾元盛世科技有限公司 All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

import { Component, HostBinding, Renderer, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { WeUIFormControl } from './weui.form.control';


const WEUI_FORM_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WeUICheckbox),
    multi: true
};

@Component({
    selector: 'weui-checkbox',
    providers: [WEUI_FORM_CONTROL_VALUE_ACCESSOR],
    template: `
        <label class="weui-check__label" [for]="id" (click)="onTouched()">
            <div class="weui-cell__hd">
                <input type="checkbox" class="weui-check"
                    [attr.id]="id" [attr.name]="name" [value]="value"
                    [checked]="checked" [(ngModel)]="innerValue">
                <i class="weui-icon-checked"></i>
            </div>
            <div class="weui-cell__bd">
                {{label}}<ng-content></ng-content>
            </div>
        </label>
    `
})
export class WeUICheckbox extends WeUIFormControl {

    /** @internal */
    checked = false;

    /** @internal */
    values: any[] = [];

    /**
     * The value of the input ngModel
     *
     * @internal (view -> model)
     */
    set innerValue(checked: boolean) {
        this._value = checked || false;

        const index = this.values.indexOf(this.value);
        if (checked) {
            if (index === -1) {
                this.values.push(this.value);
            }
        } else {
            if (index >= 0) {
                this.values.splice(index, 1);
            }
        }

        // view -> model -> outside world (ie. NgModel on this control)
        this.onChange(this.values);

        // console.log('innerValue: id=' + this.id + ', name=' + this.name
        //  + ', values=' + JSON.stringify(this.values) + ', checked=' + this._value);
    }

    /**
     * Write a new value to the element.
     *
     * @internal (From ControlValueAccessor interface)
     */
    writeValue(value: any): void {
        if (value !== null) {
            this.values = value;
        }

        this.checked = this.values.indexOf(this.value) >= 0;
        super.writeValue(this.checked);

        // console.log('writeValue: id=' + this.id + ', name=' + this.name
        //  + ', values=' + JSON.stringify(this.values) + ', checked=' + this._value);
    }

    /**
     * 扩展样式
     */
    @HostBinding('class') get hostCls(): string {
        return [super.getBasicControlCls(), 'weui-check__label', (this.additionalCls || '')].join(' ');
    }

    constructor(private renderer: Renderer, private elementRef: ElementRef) {
        super(renderer, elementRef);
        this.value = 'on'; // default value
    }

}
