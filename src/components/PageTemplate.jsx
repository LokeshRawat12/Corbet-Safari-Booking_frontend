import PropTypes from "prop-types";

export default function PageTemplate({ title, description, children, dark = false }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className={`text-3xl font-extrabold sm:text-4xl ${dark ? 'text-white' : 'text-text'}`}>{title}</h1>
        {description && (
          <p className={`mx-auto mt-3 max-w-2xl text-base sm:text-lg ${dark ? 'text-white/80' : 'text-text/70'}`}>
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
  dark: PropTypes.bool,
};

