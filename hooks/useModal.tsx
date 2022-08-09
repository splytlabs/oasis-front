import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModalComponent<T = any> = React.FC<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModalOpenDispatcher = (Component: ModalComponent, props: any) => void;
type ModalCloseDispatcher = (Component: ModalComponent) => void;

interface ModalState {
  Component: ModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
}

export const ModalsDispatchContext = createContext<{
  open: ModalOpenDispatcher;
  close: ModalCloseDispatcher;
}>({
  open: () => {
    return;
  },
  close: () => {
    return;
  },
});

export const ModalsStateContext = createContext<ModalState[]>([]);

export const ModalProvider: React.FC<{
  children: ReactElement[] | ReactElement;
}> = ({ children }) => {
  const [openedModals, setOpenedModals] = useState<ModalState[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const open = useCallback((Component: ModalComponent, props: any) => {
    setOpenedModals((modals) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return [...modals, { Component, props }];
    });
  }, []);

  const close = useCallback((Component: ModalComponent) => {
    setOpenedModals((modals) => {
      return modals.filter((modal) => {
        return modal.Component !== Component;
      });
    });
  }, []);

  const dispatch = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ModalsDispatchContext.Provider value={dispatch}>
      <ModalsStateContext.Provider value={openedModals}>
        {children}
      </ModalsStateContext.Provider>
    </ModalsDispatchContext.Provider>
  );
};

export const useModals = () => {
  const { open, close } = useContext(ModalsDispatchContext);

  const openModal = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Component: ModalComponent, props: any) => {
      open(Component, props);
    },
    [open]
  );

  const closeModal = useCallback(
    (Component: ModalComponent) => {
      close(Component);
    },
    [close]
  );

  return {
    openModal,
    closeModal,
  };
};

export const Modals = () => {
  const openModals = useContext(ModalsStateContext);
  const { close } = useContext(ModalsDispatchContext);

  return (
    <>
      {openModals.map((modal, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { Component, props } = modal;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const onClose =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          props.onClose ||
          (() => {
            close(Component);
          });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return <Component key={index} {...{ ...props, onClose }} />;
      })}
    </>
  );
};
