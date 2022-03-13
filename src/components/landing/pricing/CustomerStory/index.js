import { Card } from "antd";

const CustomerStory = ({
  name,
  title,
  mugshot,
  testimonial,
  companyLogo,
  companyName,
  href,
}) => {
  const mugshotAlt = `${name}, ${title}`;
  const companyLogoAlt = `${companyName} logo`;

  return (
    <Card className="shadow" style={{ padding: "0" }}>
      <a
        style={{ cursor: !!href ? "pointer" : "default" }}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
      >
        <div
          style={{
            color: "#333",
            padding: "4",
            margin: "0 auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
            textAlign: "center",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              style={{ height: "4rem", width: "4rem", borderRadius: "1000px" }}
              src={mugshot}
              alt={mugshotAlt}
            />
            <img
              style={{ width: "8rem", height: "2rem", objectFit: "contain" }}
              src={companyLogo}
              alt={companyLogoAlt}
            />
          </div>
          <p
            style={{ textAlign: "left", marginBottom: "0", fontSize: "1rem" }}
            className="mb-0 display-6 text-gray w-100 text-left"
          >
            <span
              style={{ fontWeight: "600" }}
              className="text font-weight-bold"
            >
              {name},{" "}
            </span>
            <span>{title}</span>
          </p>
          <h5
            style={{ textAlign: "left", fontSize: "1rem" }}
            className="mb-0 lead text-left text-gray"
          >
            {testimonial}
          </h5>
        </div>
      </a>
    </Card>
  );
};

export default CustomerStory;
