---
title: 'Create Modal API with hook',
date: '2020-05-21'
---

```css
/* Modal.scss */
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

```js
// Modal.tsx

import React, {
  useState,
  useCallback,
  useContext,
  ReactNode
} from 'react';
import { createPortal } from 'react-dom';

import './Modal.scss'

let zIndex = 1000;

interface ModalProps {
  visible: boolean,
  children: ReactNode
}

export function Modal(props: ModalProps) {
  const { visible, children } = props;

  if (!visible) {
    return null;
  }

  return (
    <div className="modal" style={{ zIndex: zIndex++ }}>
      <div className="modal-contents">
        {children}
      </div>
    </div>
  )
}


interface ModalData {
  id: number,
  content: ReactNode
}

function ModalContainer({ modals }: { modals: ModalData[] }) {
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


interface ModalContextValue {
  openModal: (content: ReactNode) => number,
  closeModal: (id: number) => void
}

const ModalContext = React.createContext<ModalContextValue>({
  openModal: (content: ReactNode) => -1,
  closeModal: (id: number) => {}
});


let modalId = 0;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalData[]>([]);

  const openModal = useCallback((content: ReactNode) => {
    const id = modalId++;
    setModals(modals => [
      ...modals,
      {
        id,
        content
      }
    ]);
    return id;
  }, [setModals]);

  const closeModal = useCallback((id: number) => {
    setModals(modals => modals.filter(m => m.id !== id));
  }, [setModals]);

  return (
    <ModalProvider.Provider value={{ openModal, closeModal }}>
      <ModalContainer modals={modals} />
      {children}
    </ModalProvider.Provider>
  );
}


export function useModal() {
  const modalHelpers = useContext(ModalContext);
  return modalHelpers;
}


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