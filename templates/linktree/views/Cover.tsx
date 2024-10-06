import type { Config } from "..";

export default function CoverView(config: Config) {
  // const config = {
  //   links: [],
  //   cover: {
  //     title: "My Links",
  //     titleColor: "#000",
  //     backgroundColor: "#fbbf24",
  //     usernameColor: "#15803d",
  //   },
  //   userData: {
  //     userImageUrl: "https://i.imgur.com/mt3nbeI.jpg",
  //     username: "complexlity",
  //   },
  // };
  const userData = config.userData;
  const title = config.cover.title;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: config.cover.backgroundColor,
        fontSize: 32,
        fontWeight: 600,
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          style={{
            color: config.cover.titleColor,
            gap: "1rem",
            fontSize: "4.5rem",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {title}
        </p>

        <svg
          tw="relative fill-blue-500 relative -top-20 -left-10"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          fill={config.cover.linkTreeColor ?? config.cover.titleColor}
          width="300px"
          height="300px"
          shapeRendering={"geometricPrecision"}
          textRendering={"geometricPrecision"}
          imageRendering={"optimizeQuality"}
          fillRule={"evenodd"}
          clipRule={"evenodd"}
        >
          <g>
            <path
              opacity={0.996}
              d="M 108.5,44.5 C 115.833,44.5 123.167,44.5 130.5,44.5C 130.333,56.5046 130.5,68.5046 131,80.5C 139.333,72.1667 147.667,63.8333 156,55.5C 160.833,60.3333 165.667,65.1667 170.5,70C 162.137,78.6975 153.47,87.0308 144.5,95C 157.18,95.1674 169.846,95.6674 182.5,96.5C 181.54,102.773 181.207,109.107 181.5,115.5C 169.149,115.168 156.815,115.501 144.5,116.5C 153.14,124.806 161.807,133.139 170.5,141.5C 166.167,146.5 161.5,151.167 156.5,155.5C 143.864,144.199 131.531,132.532 119.5,120.5C 106.864,131.801 94.5311,143.468 82.5,155.5C 77.5,151.167 72.8333,146.5 68.5,141.5C 77.1401,133.194 85.8068,124.861 94.5,116.5C 81.8508,115.501 69.1842,115.168 56.5,115.5C 56.5,108.833 56.5,102.167 56.5,95.5C 69.1711,95.6666 81.8377,95.4999 94.5,95C 85.6561,86.9885 76.9894,78.8218 68.5,70.5C 72.8333,65.5 77.5,60.8333 82.5,56.5C 91.4931,63.8267 99.8264,71.8267 107.5,80.5C 108.499,68.5185 108.832,56.5185 108.5,44.5 Z"
            />
          </g>
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          position: "absolute",
          bottom: "2.5rem",
          right: "2.5rem",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <span
          style={{
            color: config.cover.usernameColor,
            fontSize: "3rem",
          }}
        >
          @{userData.username}
        </span>
        <div
          style={{
            borderRadius: "9999px",
            display: "flex",
            width: "80px",
            height: "80px",
            overflow: "hidden",
          }}
        >
          <img
            src={userData.userImageUrl}
            width="80px"
            height="80px"
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
}
