
const ProductSection = ({ title }) => {
  return (
    <section className="product-section my-8 px-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 h-48 flex justify-center items-center"
          >
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
