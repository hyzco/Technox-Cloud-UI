// ** React Imports
import { useState, ChangeEvent } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import React from "mdi-material-ui/React";
import Vuejs from "mdi-material-ui/Vuejs";
import Angular from "mdi-material-ui/Angular";
import Laravel from "mdi-material-ui/Laravel";

// ** Custom Avatar Component
import CustomAvatar from "src/@core/components/mui/avatar";
import Grid from "@mui/material/Grid";

interface ICatalogApp {
  appName: string;
  appVersion: string;
  appDesc: string;
  appIcon: string;
}

const APP_CATALOG = [
  {
    appName: "React",
    appVersion: "17.0.2",
    appDesc: "React - a JavaScript library for building user interfaces",
    appIcon: "https://img.icons8.com/plasticine/100/react.png",
  },
  {
    appName: "Angular",
    appVersion: "12.0.0",
    appDesc: "Angular - a platform for building web applications",
    appIcon: "https://img.icons8.com/fluency/48/angularjs.png",
  },
  {
    appName: "Vue",
    appVersion: "3.2.6",
    appDesc:
      "Vue.js - a progressive JavaScript framework for building user interfaces",
    appIcon: "https://img.icons8.com/color/48/vue-js.png",
  },
  {
    appName: "Laravel",
    appVersion: "8.60.0",
    appDesc: "Laravel - a web application framework with expressive syntax",
    appIcon: "https://img.icons8.com/stickers/100/laravel.png",
  },
  {
    appName: "Express.js (Node.js 14.17.0)",
    appVersion: "4.17.1",
    appDesc: "Express.js - a fast, unopinionated web framework for Node.js",
    appIcon: "https://img.icons8.com/fluency/48/node-js.png",
  },
  {
    appName: "Django",
    appVersion: "3.2.4",
    appDesc: "Django - a high-level Python web framework",
    appIcon: "https://img.icons8.com/material-two-tone/96/django.png",
  },
  {
    appName: "Ruby on Rails",
    appVersion: "6.1.3",
    appDesc:
      "Ruby on Rails - a server-side web application framework written in Ruby",
    appIcon: "https://img.icons8.com/windows/96/ruby-on-rails.png",
  },
  {
    appName: "Node.js",
    appVersion: "14.17.0",
    appDesc:
      "Node.js - a JavaScript runtime built on Chrome's V8 JavaScript engine",
    appIcon: "https://img.icons8.com/fluency/48/node-js.png",
  },
  {
    appName: "Java (open source)",
    appVersion: "17",
    appDesc: "Java - a general-purpose programming language",
    appIcon: "https://img.icons8.com/color/96/java-coffee-cup-logo--v1.png",
  },
  {
    appName: "Python",
    appVersion: "3.9.5",
    appDesc: "Python - a versatile programming language",
    appIcon: "https://img.icons8.com/color/96/python--v1.png",
  },
];

const TabApplication = () => {
  const [value, setValue] = useState<string>("react");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const renderApps = (props: ICatalogApp) => {
    return (
      <Grid item xs={2} sm={6} xl={4}>
        <Box
          onClick={() => setValue("react")}
          sx={{
            mb: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CustomAvatar
              skin="light"
              color="info"
              variant="rounded"
              sx={{ mr: 3, width: 60, height: 60 }}
            >
              <img
                width="52"
                height="52"
                style={{ background: "white" }}
                src={props.appIcon}
                alt={`${props.appName} ${props.appVersion} ${props.appDesc}`}
              />
            </CustomAvatar>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ color: "text.secondary" }}>
                {props.appName} {props.appVersion}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  maxWidth: "80%",
                  textAlign: "start",
                  color: "text.disabled",
                }}
              >
                {props.appDesc}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Select Application
      </Typography>
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={0}>
          {[...APP_CATALOG].map((app: ICatalogApp) => {
            return renderApps(app);
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default TabApplication;
