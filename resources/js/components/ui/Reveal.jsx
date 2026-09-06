import { motion } from "framer-motion";

const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Reveal({ children, delay = 0, y = 30, duration = 0.6, className = "", ...props }) {
    if (prefersReduced) return <div className={className} {...props}>{children}</div>;
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px", amount: 0.2 }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function Stagger({ children, stagger = 0.08, className = "", ...props }) {
    if (prefersReduced) return <div className={className} {...props}>{children}</div>;
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px", amount: 0.15 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
