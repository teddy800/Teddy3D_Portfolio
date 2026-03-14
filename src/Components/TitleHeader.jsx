import { motion } from "framer-motion";
import { memo } from "react";

const TitleHeader = memo(({ title, sub }) => {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        // once:true — never re-animates on scroll back, saves work
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-lg font-medium text-white-50">{sub}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      </motion.div>
    </div>
  );
});

TitleHeader.displayName = "TitleHeader";
export default TitleHeader;
