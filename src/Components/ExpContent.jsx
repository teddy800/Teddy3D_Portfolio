const ExpContent = ({ expContent }) => {
  return (
    <div className="p-10 card-border rounded-xl">
      <h1 className="text-3xl font-semibold">{expContent.title}</h1>
      <p>{expContent.date}</p>
      <p className="text-white-50">Responsibilities</p>
      <ul className="list-disc ms-5 text-white-50">
        {expContent.responsibilities.map((responsibility, index) => (
          <li key={index}>{responsibility}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpContent;