---
title: 'React Custom Hook is great'
date: '2020-06-21'
publish: True
---

## What is React Hook?

[Hooks were introduced in React version 16.8](https://reactjs.org/docs/hooks-intro.html), they give us a way to write stateful function components, say good bye to class component life cycle.

Although not everything is perfect, and Hooks still received negative opinions from community, I want to focus on the good side, is that Hooks can make our life easier with its simplicity syntax and reusability.

This post isn't about Hooks, or more accurately it's not about the **"official Hooks"** - Hooks that built into React and help us deal with component's state, side effects or some other things. This post is about Hooks that you can write by your own, they called them Custom Hooks.

So what is a Custom Hook ?

From [official document](https://reactjs.org/docs/hooks-custom.html):

"Building your own Hooks lets you extract component logic into reusable functions."

Honestly I don't have the ability to explain what is an Custom Hook by words, so I will instead demonstrate its concept by some use-cases that I encountered at work.

## What can Custom Hooks do ?

Basically any logic that you may reuse at many components can be made to be Custom Hook. I will walk you through some examples bellow.

### 1. Input control

Usually when you need to make a controlled input with Hook you can do it like this, provide that we have an extra handler for Enter key:

```js
import React, { useState } from 'react';
import KeyCode from 'constant/KeyCode';

export default SomeComponent() {
  
  // Other logic

  // we utilize useState Hook here
  const [inputValue, setInputValue] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode === KeyCode.ENTER) {
      // Do something
    }
  }

  return (
    <>
      ...
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      ...
    <>
  );
}
```

You will see this kind of code repeated every where you have input elements, so naturally this should and can be extract to a Custom Hook to reduce duplication.

Let's make it.

```js
// common/hooks/useInput.tsx

import React, { useState } from 'react';
import KeyCode from 'constants/KeyCode';

export default function useInput(
  onEnterKeyPress?: () => void = () => {}
) {
  const [value, setValue] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode === KeyCode.ENTER) {
      onEnterKeyPress();
    }
  }

  return {value, handleChange, handleKeyDown};
}
```

Now modify our component to use this new `useInput` Hook

```js
import React from 'react';
import useInput from 'hooks/useInput';

export default SomeComponent() {
  
  // Other logic

  function handleEnterKeyPress() {
    // do something
  }

  // we utilize our Hook now
  const {
    value, handleChange, handleKeyDown
  } = useInput(handleEnterKeyPress);

  return (
    <>
      ...
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      ...
    <>
  );
}
```

So what we did here is bring all the logic part to a separate file:

- Create a state variable `value` with `useState` Hook
- Create a change handler that receive a `ChangeEvent`, update `value` state with `event.target.value`
- Create a key press handler that receive a `KeyboardEvent` and check for `Enter` key. After detect the event, we know that we should do something, but that logic can not be generalize, so the actual handler will need to be passed to the Hook, we assign it to a function parameter `onEnterKeyPress`
- Lastly return an array contains state value, change handler, and key press handler.

That's the gist of it.

### 2 Declarative modal control

If you've ever work with a React component library and use their modal, you probably saw this pattern:

```js
const [visible, setVisible] = useState(false);

function handleShowModal() {
  setVisible(true);
}

function handleHideModal() {
  setVisible(false);
}

return (
  <div>
    <Modal visible={visible}>
      <div>
        <button onClick={handleHideModal}>Close modal</button>
        /* Modal content */
      </div>
    </Modal>
    <button
      onClick={handleShowModal}
    >
      Open modal
    </button>
  </div>
)
```

Normally with this approach we provide Modal a visibility state, and Modal will show/hide depends on that state value. And the Modal will be placed preemptively in components.

And there're times that you don't want use Modal this way, you want to be able to do something like this:

```js
function handleHideModal() {
  // ??
  hideModal();
}

function handleShowModal() {
  // ??
  showModal(
    <div>
      <button onClick={handleHideModal}>Close modal</button>
      /* Modal content */
    </div>
  );
}

return (
  <div>
    <button
      onClick={handleShowModal}
    >
      Open modal
    </button>
  </div>
)
```

Instead of predefine a Modal in component, you dynamically call a function, pass to it Modal's content and the Modal appear. Then when you want to close the Modal, you call another function. Kinda neat right?

So how can we archive this?

Remember how we used to do this kind of task with jQuery? We make a Modal code, we put it in a function, when function is called we query document body and append Modal code to make a child element.

We will do a similar thing here, with the help of `context` and `createPortal`.

First, make a Modal component

```js
// components/modal/Modal.tsx

import React, { ReactNode } from "react";

import "./Modal.scss";

let zIndex = 1000;

interface ModalProps {
  visible: boolean;
  children: ReactNode;
}

export default function Modal(props: ModalProps) {
  const { visible, children } = props;

  if (!visible) {
    return null;
  }

  return (
    <div className="modal" style={{ zIndex: zIndex++ }}>
      <div className="modal-contents">{children}</div>
    </div>
  );
}
```

```css
/* components/modal/Modal.scss */

.modal {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-contents {
    position: fixed;
    padding: 0;
    border: 0;
    background-color: transparent;
  }
}
```

This Modal works just as ordinary Modals

```js
<Modal
  visible={<true|false>}
>
  {<Modal content>}
</Modal>
```

Second, we make a ModalContainer, which contain an array of Modals:

```js
// components/modal/ModalContainer.tsx

import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import Modal from "./Modal";

export interface ModalData {
  id: number;
  content: ReactNode;
}

export default function ModalContainer({ modals }: { modals: ModalData[] }) {
  return createPortal(
    <>
      {modals.map(modal => (
        <Modal visible key={modal.id}>
          {modal.content}
        </Modal>
      ))}
    </>,
    document.body
  );
}
```

This container receive an array of Modals as a prop and render them into `document.body` using `createPortal`.

Incase you haven't heard about `portal` read more about it [here](https://reactjs.org/docs/portals.html);

Third, make a context that allow us to work with Modals:

```js
// context/modalContext.tsx

import React, { ReactNode } from "react";

interface ModalContextValue {
  openModal: (content: ReactNode) => number;
  closeModal: (id: number) => void;
}

const ModalContext = React.createContext<ModalContextValue>({
  openModal: (content: ReactNode) => -1,
  closeModal: (id: number) => {}
});

export default ModalContext;
```

This context expose 2 method:
- openModal: create a Modal, place its content argument into the Modal
- closeModal: close the Modal

Why are there `id`s here? We will see what it does in next step.

Forth, use this context to make a provider

```js
// providers/ModalProvider.tsx

import React, { useState, useCallback, ReactNode } from "react";
import ModalContext from "../contexts/modalContext";
import ModalContainer, { ModalData } from "../components/modal/ModalContainer";

let modalId = 0;

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalData[]>([]);

  const openModal = useCallback(
    (content: ReactNode) => {
      const id = modalId++;
      setModals(modals => [
        ...modals,
        {
          id,
          content
        }
      ]);
      return id;
    },
    [setModals]
  );

  const closeModal = useCallback(
    (id: number) => {
      setModals(modals => modals.filter(m => m.id !== id));
    },
    [setModals]
  );

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <ModalContainer modals={modals} />
      {children}
    </ModalContext.Provider>
  );
}
```

This provider will initiate modal context, manage modal array, when `openModal` is called, a new Modal will be added to the state with an incremental `id`, this array state then is passed to `ModalContainer` to be rendered into the dom.

Why the `id` is necessary here? Well it technically isn't, we can just push and pop the latest modal in the array, that your choice.

Now bring this provider to our App

```js
// App.tsx

import * as React from "react";
import ModalProvider from "./providers/ModalProvider";
import Layout from "./Layout";
import "./styles.css";

export default function App() {
  return (
    <ModalProvider>
      <Layout />
    </ModalProvider>
  );
}
```

Everything under Layout now can connect to `ModalContext` and use its api to work with Modal, for example:

```js
// Layout.tsx

import React, { useContext } from "react";
import ModalContext from "./context/modalContext.tsx";
import "./Layout.scss";

export default function Layout() {
  const { openModal, closeModal } = useContext(ModalContext);

  let modalId: number;

  function handleHideModal() {
    closeModal(modalId);
  }

  function handleShowModal() {
    modalId = openModal(
      <div className="my-modal">
        <button onClick={handleHideModal}>Close modal</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Hi</h1>
      <h2>I'm reactjs</h2>
      <button onClick={handleShowModal}>Open modal</button>
    </div>
  );
}
```

And we can shorten the syntax by making a Custom Hook for the context usage:

```js
// hooks/useModal.tsx

import React, { useContext } from 'react';
import ModalContext from '../context/modalContext.tsx';

export default function useModal() {
  const modal = useContext(ModalContext);
  return modal;
}
```

Then we can rewrite Layout.tsx like this:

```js
import React from "react";
import useModal from "./hooks/useModal";
import "./Layout.scss";

export default function Layout() {
  const modal = useModal();

  let modalId: number;

  function handleHideModal() {
    modal.closeModal(modalId);
  }

  function handleShowModal() {
    modalId = modal.openModal(
      <div className="my-modal">
        <button onClick={handleHideModal}>Close modal</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Hi</h1>
      <h2>I'm reactjs</h2>
      <button onClick={handleShowModal}>Open modal</button>
    </div>
  );
}
```

From now on we can use `useModal` Hook every where under `Layout` tree.

To provide another usage of `useModal` Hook, take a look at this `useConfirm`: it's mission is to display a confirm message, and do thing depends on use click `OK` or `Cancel`

```js
// hooks/useConfirm.tsx

import React from 'react';
import useModal from './useModal';

interface ConfirmData {
  text: string,
  onConfirm: () => void,
  onCancel: () => void
}

export function useConfirm() {
  const { openModal, closeModal } = useModal();

  return ((data: ConfirmData) => {
    function handleConfirm(modalId: number) {
      data.onConfirm();
      closeModal(modalId);
    }

    function handleCancel(modalId: number) {
      data.onCancel();
      closeModal(modalId);
    }

    const modalId = openModal(
      <div className="confirm">
        <p>{data.text}</p>
        <div>
          <button
            className="btn primary"
            onClick={() => handleConfirm(modalId)} 
          >
            OK
          </button>
          <button
            className="btn"
            onClick={() => handleCancel(modalId)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  });
}
```

To use this Hook:

```js
import useConfirm from 'hooks/useConfirm';

export default function SomeComponent() {
  const confirm = useConfirm();

  function handleShowConfirm() {
    confirm({
      text: 'Are you sure?',
      onConfirm: () => {/* do thing */},
      onCancel: () => {/* do other thing */}
    });
  }
}
```

### 3. Out of bound click detection

Another common frontend task is to detect user click outside of an element.

With React we can do it like this:

```js
import React, { useEffect } from 'react';

export default function SomeComponent() {

  const ref = React.createRef<HTMLDivElement>();

  const handleOutOfBoundClick = useCallback(() => {
    /* do something */
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleOutOfBoundClick();
      }
    }

    document.addEventListener('click', handleClick);

    return (() => {
      document.removeEventListener('click', handleClick);
    });
  }, [ref, handleOutOfBoundClick]);
  
  return (
    <div>
      <div ref={ref}>
        /* something */
      </div>
    </div>
  );
}
```

The logic inside `useEffect` Hook totally can be made into Custom Hook and reuse elsewhere.

```js
// hooks/useOutOfBoundClick.tsx

import React, { useEffect } from "react";

export default function useOutOfBoundClick(
  ref: React.RefObject<HTMLElement>,
  onOutOfBoundClick: () => void
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutOfBoundClick();
      }
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, onOutOfBoundClick]);
}
```

Now let's use this Hook in our component:

```js
import React, { useEffect } from 'react';
import useOutOfBoundClick from '../hooks/useOutOfBoundClick';

export default function SomeComponent() {

  const ref = React.createRef<HTMLDivElement>();

  const handleOutOfBoundClick = useCallback(() => {
    /* do something */
  }, []);

  useOutOfBoundClick(ref, handleOutOfBoundClick);
  
  return (
    <div>
      <div ref={ref}>
        /* something */
      </div>
    </div>
  );
}
```

## Demo

You can find all demo code for this post [here](https://codesandbox.io/s/custom-hooks-4keby)

## Conclusion

This post is way too long, I do hope someone can get something out of it.