"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  onClose: () => void;
  isOpen: boolean;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal = ({ onClose, onConfirm, loading, isOpen }: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title='Are you sure?'
      description="This action cannot be undone"
      onClose={ onClose }
      isOpen={ isOpen }
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={ loading } variant="outline" onClick={ onClose }>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>Continue</Button>
      </div>
    </Modal>
  );
}

export default AlertModal;