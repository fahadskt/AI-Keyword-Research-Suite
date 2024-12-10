import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Globe } from 'lucide-react';

const About = () => {
  const skills = [
    { icon: <Code size={24} />, title: 'Frontend Development', description: 'React, Vue, Angular' },
    { icon: <Globe size={24} />, title: 'Backend Development', description: 'Node.js, Python, Java' },
    { icon: <Palette size={24} />, title: 'UI/UX Design', description: 'Figma, Adobe XD' },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I'm a passionate developer with over 5 years of experience in creating web applications.
            I love turning complex problems into simple, beautiful, and intuitive solutions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-6 bg-gray-50 rounded-lg text-center"
            >
              <div className="inline-block p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
                {skill.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
              <p className="text-gray-600">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;