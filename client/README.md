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

why am I not redirected to dashboard?

- to go to dashboard I have to click twice
  - this has nothing to do with the effects
  - I think it's because the route is reading the state before it's been set
  - I'll try to fix this by adding an effect.
    - Should I create another state variable isSubmitted or should I just check if deskId context is set (all of this in useEffect)
    - I'll create another state variable
- when page refreshes, localstorage is set to null
  - The problem with this is that the effect to update localstorage is ran right after the effect that updates state with localstorage.
  - I'll fix it by changing the second effect to only set localstorage when deskId has an actual value

performance

- when can i define a function outside of a component?

TODO:

- Add try catch to create/call client and use sonner to use loading/ error state with the mutation middleware properties/functions
- change name of call client to dequeue client

Do I want the selected department to be persisted? I'd say yes.

\*\* Left off on using our own state for the form as opposed as the one in the form

table TODO:

- make sure table is always of size 10
- fix table filtering
- implement hooks in cell function
  - for getting department name and setting an action for button

Why is deskId key set to "deskId" in state and storage?

- undefined key is also set to "deskId"
- I think it was because of when I was changing the file ant I never cleared it. It should be fine now, it was just some intermediate state

TODO: for UI

- query every 5 seconds DONE
- table
- nav DONE
  - select desk DONE
  - log out DONE
- make dashboard look better DONE
- kiosk page
- deisplay page

If I want clients to be sorted by update time, I'll have to update their version column each time I call them. That's not a priority right now.

For display, I can show the most recent one by sorting the desks by updatedAt

Should I add client to table when I create one?

- Since I have an array, it is not easy to modify. It was just easier to invalidate the clients query

should i export auth or use getAuth() when I need user for firebase auth?
