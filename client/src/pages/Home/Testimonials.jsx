import React from 'react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    content: "This exercise catalog has transformed my workout routine. The detailed instructions and form guides have helped me avoid injuries and maximize results.",
  },
  {
    name: "Mike Chen",
    role: "Personal Trainer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    content: "I recommend this platform to all my clients. The variety of exercises and clear categorization makes it easy to create custom workout plans.",
  },
  {
    name: "Emily Rodriguez",
    role: "Yoga Instructor",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    content: "The attention to detail in each exercise description is impressive. It's like having a personal trainer in your pocket!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Join thousands of satisfied users who have improved their fitness journey with our exercise catalog.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-8 bg-white rounded-2xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <img
                  className="h-12 w-12 rounded-full ring-4 ring-white"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
              </div>

              <div className="pt-4 text-center">
                <blockquote>
                  <p className="text-lg font-medium text-gray-900 mt-8">
                    "{testimonial.content}"
                  </p>
                </blockquote>
                <div className="mt-6">
                  <p className="text-base font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="absolute top-8 right-8 text-gray-200">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 