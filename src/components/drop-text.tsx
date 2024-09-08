import { motion } from "framer-motion";
import DropCharacters from "./drop-characters";

const TextDrop = ({ text }: { text: string }) => {
  const container = {
    visible: {
      transition: {
        staggerChildren: 0.025,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={container}>
      <div>
        <DropCharacters
          text={text}
          className="font-medium tracking-tight text-neutral-900" // Add your own class names here
        />
      </div>
    </motion.div>
  );
};

export default TextDrop;
