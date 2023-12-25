"use client";

import { useEffect, useState } from "react";
import { Modal } from "./ui/modal";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/states/store";
import { useDispatch } from "react-redux";
import { onClose, onOpen } from "@/states/slices/modalSlice";

const ProjectInfoModal = () => {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const handleClose = () => {
    dispatch(onClose());
  }

  useEffect(() => {
    setIsMounted(true);
    dispatch(onOpen());
  }, []);
  
  if (!isMounted) return null;
  
  return (
    <Modal
      isOpen={ isOpen }
      onClose={ handleClose }
      title="How to navigate the project?"
      description="This is the store side of my ecommerce project. Everything present at the admin side (Products, Billboards, Categories, Sizes, etc.) will be visible here."
    >
      <div>
        <ul className="list-disc ml-6">
          <li>This page which you&apos;ll see after closing this modal is the dashboard page which will show you the stats of your store. How many orders were placed, how many were completed etc.</li>
          <li>On the navbar you can see different pages. Going on each page you can add billboards, categories, sizes, colors, products etc. These will be visible on the <Link className='text-blue-500 font-bold underline' href='https://ecommerce-store-side.vercel.app/' target="_blank">store side.</Link></li>
          <li>Basically this will act as a mini CMS for the <Link className='text-blue-500 font-bold underline' href='https://ecommerce-store-side.vercel.app/' target="_blank">store side.</Link></li>
          <li>On each page API Routes are displayed as well for frontend engineers to access data easily.</li>
        </ul>
      </div>
    </Modal>
  );
}

export default ProjectInfoModal;