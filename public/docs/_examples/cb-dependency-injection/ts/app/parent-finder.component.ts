/* tslint:disable:no-unused-variable */
/* tslint:disable:one-line:check-open-brace*/
// #docplaster
// #docregion
import { Component, forwardRef, Optional, provide, SkipSelf } from 'angular2/core';

// A component base class (see AlexComponent)
export abstract class Base { name = 'Count Basie'; }

// Marker class, used as an interface
// #docregion parent
export abstract class Parent { name: string; }
// #enddocregion parent

const DifferentParent = Parent;

// #docregion provide-parent, provide-the-parent
// Helper method to provide the current component instance in the name of a `parentType`.
// #enddocregion provide-the-parent
// The `parentType` defaults to `Parent` when omitting the second parameter.
// #docregion provide-the-parent
const provideParent =
// #enddocregion provide-parent, provide-the-parent
// #docregion provide-parent
  (component: any, parentType?: any) =>
    provide(parentType || Parent, { useExisting: forwardRef(() => component) });
// #enddocregion provide-parent

// Simpler syntax version that always provides the component in the name of `Parent`.
const provideTheParent =
// #docregion provide-the-parent
  (component: any) => provide(Parent, { useExisting: forwardRef(() => component) });
// #enddocregion provide-the-parent


///////// C - Child //////////
// #docregion carol
const templateC = `
  <div class="c">
    <h3>{{name}}</h3>
    <p>My parent is {{parent?.name}}</p>
  </div>`;

@Component({
  selector: 'carol',
  template: templateC
})
// #docregion carol-class
export class CarolComponent {
  name= 'Carol';
  // #docregion carol-ctor
  constructor( @Optional() public parent: Parent ) { }
  // #enddocregion carol-ctor
}
// #enddocregion carol-class
// #enddocregion carol

@Component({
  selector: 'chris',
  template: templateC
})
export class ChrisComponent {
  name= 'Chris';
  constructor( @Optional() public parent: Parent ) { }
}

//////  Craig ///////////
/**
 * Show we cannot inject a parent by its base class.
 */
// #docregion craig
@Component({
  selector: 'craig',
  template: `
  <div class="c">
    <h3>Craig</h3>
    {{alex ? 'Found' : 'Did not find'}} Alex via the base class.
  </div>`
})
export class CraigComponent {
  constructor( @Optional() public alex: Base ) { }
}
// #enddocregion craig

// #docregion C_DIRECTIVES
const C_DIRECTIVES = [
  CarolComponent, ChrisComponent, CraigComponent,
  forwardRef(() => CathyComponent)
];
// #enddocregion C_DIRECTIVES

//////// B - Parent /////////
// #docregion barry
const templateB = `
  <div class="b">
    <div>
      <h3>{{name}}</h3>
      <p>My parent is {{parent?.name}}</p>
    </div>
    <carol></carol>
    <chris></chris>
  </div>`;

@Component({
  selector:   'barry',
  template:   templateB,
  directives: C_DIRECTIVES,
  providers:  [ provide(Parent, { useExisting: forwardRef(() => BarryComponent) }) ]
})
export class BarryComponent implements Parent {
  name = 'Barry';
// #docregion barry-ctor
  constructor( @SkipSelf() @Optional() public parent: Parent ) { }
// #enddocregion barry-ctor
}
// #enddocregion barry

@Component({
  selector:   'bob',
  template:   templateB,
  directives: C_DIRECTIVES,
  providers:  [ provideParent(BobComponent) ]
})
export class BobComponent implements Parent {
  name= 'Bob';
  constructor( @SkipSelf() @Optional() public parent: Parent ) { }
}

@Component({
  selector:   'beth',
  template:   templateB,
  directives: C_DIRECTIVES,
// #docregion beth-providers
  providers:  [ provideParent(BethComponent, DifferentParent) ]
// #enddocregion beth-providers
})
export class BethComponent implements Parent {
  name= 'Beth';
  constructor( @SkipSelf() @Optional() public parent: Parent ) { }
}

const B_DIRECTIVES = [ BarryComponent, BethComponent, BobComponent ];

///////// A - Grandparent //////

// #docregion alex, alex-1
@Component({
  selector: 'alex',
  template: `
    <div class="a">
      <h3>{{name}}</h3>
      <cathy></cathy>
      <craig></craig>
      <carol></carol>
    </div>`,
// #enddocregion alex-1
// #docregion alex-providers
  providers: [ provide(Parent, { useExisting: forwardRef(() => AlexComponent) }) ],
// #enddocregion alex-providers
// #docregion alex-1
  directives: C_DIRECTIVES
})
// #enddocregion alex-1
// Todo: Add `... implements Parent` to class signature
// #docregion alex-1
// #docregion alex-class-signature
export class AlexComponent extends Base
// #enddocregion alex-class-signature
{
  name= 'Alex';
}
// #enddocregion alex, alex-1

/////

// #docregion alice
@Component({
  selector: 'alice',
  template: `
    <div class="a">
      <h3>{{name}}</h3>
      <barry></barry>
      <beth></beth>
      <bob></bob>
      <carol></carol>
    </div> `,
  directives: [ B_DIRECTIVES, C_DIRECTIVES ],
// #docregion alice-providers
  providers:  [ provideParent(AliceComponent) ]
// #enddocregion alice-providers
})
// #docregion alice-class-signature
export class AliceComponent implements Parent
// #enddocregion alice-class-signature
{
  name= 'Alice';
}
// #enddocregion alice

//////  Cathy ///////////
/**
 * Show we can inject a parent by component type
 */
// #docregion cathy
@Component({
  selector: 'cathy',
  template: `
  <div class="c">
    <h3>Cathy</h3>
    {{alex ? 'Found' : 'Did not find'}} Alex via the component class.<br>
  </div>`
})
export class CathyComponent {
  constructor( @Optional() public alex: AlexComponent ) { }
}
// #enddocregion cathy

///////// ParentFinder //////
@Component({
  selector: 'parent-finder',
  template: `
    <h2>Parent Finder</h2>
    <alex></alex>
    <alice></alice>`,
  directives: [ AlexComponent, AliceComponent ]
})
export class ParentFinderComponent { }