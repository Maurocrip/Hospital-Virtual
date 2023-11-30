import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation =
trigger('routeAnimations', 
[
  transition('registro => login', 
  [
    style({ position: 'relative' }),
    query(':enter, :leave', 
    [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', 
    [
      style({ left: '-100%' })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', 
      [
        animate('300ms ease-out', style({ left: '100%' }))
      ], { optional: true }),
      query(':enter', 
      [
        animate('300ms ease-out', style({ left: '0%' }))
      ], { optional: true }),
    ]),
  ]),

  transition('login => registro', 
  [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', 
    [
      style({ right: '-100%' })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', 
      [
        animate('300ms ease-out', style({ right: '100%'}))
      ], { optional: true }),
      query(':enter', 
      [
        animate('300ms ease-out', style({ right: '0%' }))
      ], { optional: true }),
      query('@*', animateChild(), { optional: true })
    ]),
  ]),

  transition('home => login', 
  [
      style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', 
    [
      style({ right: '-100%' })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', 
      [
        animate('300ms ease-out', style({ right: '100%'}))
      ], { optional: true }),
      query(':enter', 
      [
        animate('300ms ease-out', style({ right: '0%' }))
      ], { optional: true }),
      query('@*', animateChild(), { optional: true })
    ]),
  ]),

  transition('login => home', 
  [
      style({ position: 'relative' }),
    query(':enter, :leave', 
    [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', 
    [
      style({ left: '-100%' })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', 
      [
        animate('300ms ease-out', style({ left: '100%' }))
      ], { optional: true }),
      query(':enter', 
      [
        animate('300ms ease-out', style({ left: '0%' }))
      ], { optional: true }),
    ]),
  ]),

  transition('home => registro', 
  [
      style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', 
    [
      style({ right: '-100%' })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', 
      [
        animate('300ms ease-out', style({ right: '100%'}))
      ], { optional: true }),
      query(':enter', 
      [
        animate('300ms ease-out', style({ right: '0%' }))
      ], { optional: true }),
      query('@*', animateChild(), { optional: true })
    ]),
  ]),

  transition('registro => home', 
  [
      style({ position: 'relative' }),
    query(':enter, :leave', 
    [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', 
    [
      style({ left: '-100%' })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(':leave', 
      [
        animate('300ms ease-out', style({ left: '100%' }))
      ], { optional: true }),
      query(':enter', 
      [
        animate('300ms ease-out', style({ left: '0%' }))
      ], { optional: true }),
    ]),
  ]),  
]);