import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">About NeoTutor AI</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            An AI-powered EdTech application designed to transform how students and lifelong learners interact with educational materials.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">Our Mission</h3>
            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              Our goal is to make learning more efficient, accessible, and engaging for everyone. We believe that by leveraging cutting-edge AI, we can help break down complex information into manageable, interactive formats. Whether you're a student cramming for an exam or a professional looking to quickly grasp new concepts, NeoTutor AI is built to support your learning journey.
            </p>
          </div>
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">The Technology</h3>
            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
             NeoTutor AI is powered by Google's advanced Gemini model. For content generation, the AI analyzes your document to intelligently extract key information and build structured study aids. In the 'Ask AI' chat, it acts as a focused tutor, using the document's text as its sole source of knowledge to provide contextual and relevant answers, ensuring your learning stays on track.
            </p>
          </div>
           <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">A Word from the Creator</h3>
            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              NeoTutor AI is a passion project created by ProgrammerKR. It was built with the vision of making modern AI technology practical and accessible for students and learners everywhere. This tool demonstrates the power of generative AI to create personalized and effective educational experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
