import React from "react";
import { PersonalInfo } from "@/interfaces/resume";
import { TemplateConfig } from "@/interfaces/templates";

interface ClassicPersonalInfoProps {
  personalInfo: PersonalInfo;
  config: TemplateConfig;
}

const ClassicPersonalInfo: React.FC<ClassicPersonalInfoProps> = ({
  personalInfo,
  config,
}) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h1
        style={{
          fontSize: "25px",
          fontWeight: "bold",
          color: config.style.primaryColor,
          margin: "0 0 5px 0",
          fontFamily: config.style.headingFont,
          lineHeight: "1.2",
        }}
      >
        {personalInfo.fullName}
      </h1>

      <div
        style={{
          fontSize: "11px",
          color: config.style.textColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "5px",
          lineHeight: "1.5",
        }}
      >
        <span>{personalInfo.location}</span>
        <span style={{ margin: "0 5px" }}>|</span>
        <a
          href={`mailto:${personalInfo.email}`}
          style={{
            color: config.style.primaryColor,
            textDecoration: "none",
          }}
        >
          {personalInfo.email}
        </a>
        <span style={{ margin: "0 5px" }}>|</span>
        <a
          href={`tel:${personalInfo.phone}`}
          style={{
            color: config.style.primaryColor,
            textDecoration: "none",
          }}
        >
          {personalInfo.phone}
        </a>
        {personalInfo.website && (
          <>
            <span style={{ margin: "0 5px" }}>|</span>
            <a
              href={personalInfo.website}
              style={{
                color: config.style.primaryColor,
                textDecoration: "none",
              }}
            >
              {personalInfo.website}
            </a>
          </>
        )}
        {personalInfo.links?.map((link, index) => (
          <React.Fragment key={index}>
            <span style={{ margin: "0 5px" }}>|</span>
            <a
              href={link.url}
              style={{
                color: config.style.primaryColor,
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          </React.Fragment>
        ))}
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div style={{ marginTop: "16px", textAlign: "left" }}>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: config.style.primaryColor,
              margin: "0 0 8px 0",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
              fontFamily: config.style.headingFont,
            }}
          >
            Professional Summary
          </h2>
          <p
            style={{
              fontSize: "11px",
              margin: "0",
              lineHeight: "1.4",
            }}
          >
            {personalInfo.summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassicPersonalInfo;
