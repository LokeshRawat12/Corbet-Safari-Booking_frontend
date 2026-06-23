export default function TopBar() {
  return (
    <div className="bg-primary text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-6 px-4 py-2 text-sm">
        <span className="flex items-center gap-2">
          <i className="fas fa-phone" />
          <a href="tel:+918979668105" className="hover:text-secondary">
            +91-8979668105
          </a>
        </span>
        <span className="flex items-center gap-2">
          <i className="fas fa-envelope" />
          <a href="mailto:lavi29july@gmail.com" className="hover:text-secondary">
            lavi29july@gmail.com
          </a>
        </span>
      </div>
    </div>
  );
}
