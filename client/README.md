for deploying with express
- https://github.com/szymmis/vite-express

current desk
- Since I need to have a desk set to call a user and to make it easier to do stuff and prevent mistakes (not being able to change the desk all the time), I should make users choose desks with a top select. This would make the layout more similar to the dashboard example. 
- to select it, I should ask users to choose a desk after the login screen, or maybe before the dashboard? I'm not completely sure of where to put it.
- the desk should be a part of global state with user
- for selecting desk, i could check in render if (user && !desk)


do i need/should i use a store like redux or zustand?

## BUG
 
Whenever I load a page, the user is null at first

the example does the same thing

I have to find a way to make the preload funciton wait for the user state to load. I could add an await in there, but what promise am I awaiting? Maybe I could create a promise with onAuthStateChanged. But if it depends on onAuthChanged, I only have to wait in the initial load of the screen. maybe I could add this promise in the preload of the root or a route as high up as possible.

I think the problem is react router

I solved it by using an effect instead of useSyncExternalStore and by using an initializing state to block the router from loading

## QUESTIONS
how specific should i be with type (e.g. type for setter in context... define function or use React.setState<User>)

do have to always check for ispending and error qith react query

logout should remove user and desk?

use await component for initializing?

to maintain desk, I need to store it local storage. I should also not redirect to dashboard if user already has a desk.

The login page could have the two panels on desktop and the illustration panel could be a black and white graphic of the globe logo

I think I'm only going to store the deskId