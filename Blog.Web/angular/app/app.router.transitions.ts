import { trigger, animate, style, group, query, transition } from '@angular/animations';

const smoothTransition = [
  group([
    query(
      ':enter app-scroll-container',
      [
        style({  opacity: 0 }),
        animate('.3s ease-in-out', style({ opacity: 1 }))
      ],
      { optional: true }
    ),
    query(
      ':leave app-scroll-container',
      [
        style({  opacity: 1, overflow: 'hidden' }),
        animate('.3s ease-in-out', style({  transform: 'scale(0.95)', opacity: 0 }))
      ],
      { optional: true }
    )
  ])
];

export const routerTransition = trigger('routerTransition', [
  transition('home => post', smoothTransition),
  transition('post => home', smoothTransition)
]);
