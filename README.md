# 02.532: Human-Centered Design for Information Visualization

**2026 September Term**

## Assignment 1

### Reflection

In this Information Visualization assignment, I learnt what HTML (layout), CSS (visuals and colors), and JavaScript (the main programming language, similar to Python) are, and how they work together to create websites. I also learnt how a webpage project should be structured:

```
project/
├── index.html
├── css/
├── scripts/
└── images/
```

Each folder holds its respective files. I also learnt that the `<head>` of an HTML document is for metadata, while the `<body>` is where the entire visible website sits.

Along the way, I also learnt:

- How to vibe code using VS Code.
- That JavaScript is used to fetch data from an API link.
- That I can use Google Fonts inside my HTML.
- That I can create tables with D3 instead of hard coding them in plain JavaScript. D3 is kind of like JavaScript's version of Seaborn.
- How to sync my work between VS Code and GitHub:
  - **Commit:** save a snapshot of my changes locally with a message describing what I changed.
  - **Push:** upload my committed changes from VS Code to the GitHub repo.
  - **Pull:** download the latest changes from the GitHub repo into VS Code.

### Instructions

1. In the repo, create a basic `index.html` file and make it visible on GitHub Pages (under the **Settings** tab, then **Pages**).
2. You can put your CSS `<style>` tags, HTML, and JS `<script>` code into one file, or organize them into separate files and directories.
3. Connect to the data.gov.sg PSI API and get the real-time dataset. Details are available here: [PSI Dataset on data.gov.sg](https://data.gov.sg/datasets/d_fe37906a0182569d891506e815e819b7/view)
4. Print out all readings data into a table. There are 12 readings, from `o3_sub_index` to `psi_twenty_four_hourly`.
5. This is not a design challenge. The goal is to show that you can connect to an API, read and understand the JSON data, and display it in a table.
