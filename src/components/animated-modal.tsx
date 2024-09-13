"use client";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "./modal";
import Image from "next/image";
import { motion } from "framer-motion";
import { Speaker } from "@/lib/speakers";

export function AnimatedModal({ speaker }: { speaker: Speaker }) {
  return (
    <div className=" flex items-center justify-center overflow-scroll z-50 ">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            More Info
          </span>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <div className="flex justify-center items-center">
              <motion.div
                style={{
                  rotate: Math.random() * 20 - 10,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                whileTap={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
              >
                <Image
                  src={speaker.profilePicture}
                  alt="bali images"
                  width="500"
                  height="500"
                  className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                />
              </motion.div>
            </div>
            <div className="py-4 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
              <h1>{speaker.fullName}</h1>
              <p>{speaker.bio}</p>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
}
