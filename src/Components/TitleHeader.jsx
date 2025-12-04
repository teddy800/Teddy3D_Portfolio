// src/components/TitleHeader.jsx

const TitleHeader = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default TitleHeader;