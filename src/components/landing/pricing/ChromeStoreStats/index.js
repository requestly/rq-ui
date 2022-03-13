import { UserOutlined } from "@ant-design/icons";

const ChromeStoreStats = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "2rem",
        margin: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
        <span
          className="text-black rounded p-2"
          style={{
            backgroundColor: "#FBDA00",
            color: "#111",
            fontSize: "1.2rem",
            padding: "0.2rem 0.8rem",
            borderRadius: "6px",
          }}
        >
          4.7
        </span>
        {Array(5)
          .fill("")
          .map((_, idx) => (
            <img
              key={idx}
              style={{ width: "1.2rem" }}
              src="/assets/img/pricing-page/star.svg"
              alt="Star"
              loading="lazy"
            />
          ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
        <img
          style={{ width: "3rem" }}
          src="/assets/img/pricing-page/chrome-store.svg"
          alt="Chrome Store Icon"
          loading="lazy"
        />
        <span style={{ fontSize: "1.2rem" }}>900+ Reviews</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
        <span>
          <UserOutlined style={{ fontSize: "2.2rem" }} />
        </span>
        <span style={{ fontSize: "1.2rem" }}>15,000+ Active Users</span>
      </div>
    </div>
  );
};

export default ChromeStoreStats;
