"use client";

import { Modal } from "@/components/ui/modal";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { onOpen } from "@/states/slices/modalSlice";
import { useEffect, useState } from "react";

const SetupPage = () => {

  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (!isOpen) dispatch(onOpen());
  }, [isOpen]);
  
  return null;
}

export default SetupPage;