import PropTypes from "prop-types";

export default function PageTemplate({ title, description, children }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-text sm:text-4xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-3 max-w-2xl text-base text-text/70 sm:text-lg">
            {description}
          </p>
        )}
      </header>
      <section>{children}</section>
    </main>
  );
}

PageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};
