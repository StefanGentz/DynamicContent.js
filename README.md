# Dynamic Content Highlighting

## Overview

Dynamic Content Highlighting is a highly configurable, self-contained JavaScript script designed to enhance the user experience on websites by introducing a dynamic dropdown menu. This script allows users to visually highlight elements on a webpage based on the values of a specified custom attribute. Targeted at content-driven websites, it offers a seamless way to navigate and interact with dynamic content.

## Features

- Dynamically generates a dropdown menu based on unique attribute values found within a defined area of a webpage.
- Highlights matching elements upon selection from the dropdown, making it easier for users to locate content of interest.
- Configurable to use any attribute and element for dropdown generation and content highlighting.
- Self-contained with no external dependencies, ensuring ease of integration.
- Offers extensive customizability to fit the styling and functional requirements of most web projects.

> ℹ️  NOTE:
>  
> The select dropdown is only added if the script has actually found elements with the defined attribute. If no elements with the defined attribute are found, no dropdown is added, as it would otherwise result in an empty and, therefore, confusing UI element without functionality.

## Version

- 2024.4.005

## Author

- Stefan Gentz (Adobe)

## Implementation Guide

### Integration into an HTML5 Template

Integrating the Dynamic Content Highlighting script into an HTML5 template allows for enhancing static and dynamic websites with interactive content highlighting features. Follow these steps to incorporate the script into your HTML5 template:

#### Step 1: Include the Script

First, ensure the JavaScript file is accessible by placing it in a suitable directory within your project structure, such as a `js` folder. Then, include the script in your HTML5 template by adding the following `<script>` tag just before the closing `</body>` tag:

```html
<script src="path/to/js/DynamicContent.js"></script>
```

Make sure to adjust `path/to/js/dynamicContentHighlighting.js` to the actual path where your JavaScript file is located.

#### Step 2: Prepare Your HTML

The script operates based on a custom attribute (by default, `data-rev`) to generate dropdown options and highlight corresponding elements. You’ll need to ensure your HTML elements are properly marked with this attribute. For example:

```html
<div class="topic section">
    <!-- Elements to be included in the dropdown -->
    <p data-rev="2024.1">Content for 2024.1</p>
    <p data-rev="2024.2">Content for 2024.2</p>
</div>
```

In this example, the select dropdown will be populated with the values "2024.1" and "2024.2". When the user selects one of these options, the corresponding elements will be highlighted.

#### Step 3: Define Customization Variables

Inside the `DynamicContent.js` script, or within a `<script>` tag in your HTML template, define any customization variables to tailor the script’s functionality to your needs. This includes specifying the target area for the dropdown, the attribute used for highlighting, and any custom CSS styles. For example:

```javascript
const  dropdownTargetPos = document.querySelector('.topic .section');
const  attributeName = 'data-rev';
```

#### Step 4: Style Customization

Utilize the provided `customHighlightStyling()` function within the script to add custom styles for the dropdown and highlighted elements. This step is optional and depends on your site’s design requirements. You can customize the look and feel of the dropdown and highlighted content directly within the script or by linking a separate CSS file in your HTML template.

### Integration into Adobe Experience Manager (AEM) Sites

#### Prepare your DITA content

You can use the out-of-the box attributes DITA offers, e.g., `rev`, `platform`, `product`, to attribute content for dynamic content in the published site. Just add the attribute you need to any element that you want to be highlightable in the published website. You can also use your own specialized attributes as long as they are properly published in the output.

In the example below, the `rev` attribute is used:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="topic_oq1_hsz_y1c">
  <title>Dynamic Content</title>
  <body>
    <p>Just add the required attribute to your content. Example:</p>
    <ul>
      <li>
        <p>This is a list item.</p>
      </li>
      <li>
        <p rev="2024.4">This is list item was added in <b>Release 2024.4</b>.</p>
      </li>
      <li>
        <p>This is another list item.</p>
      </li>
    </ul>
  </body>
</topic>
```

Now, you only need to make sure that in `DynamicContent.js`, the `const attributeName` is defined accordingly. Make sure to prefix the attribute name with `data-` like in this example:

```javascript
const  attributeName = 'data-rev';
```

If you want to use any other attribute, you need to define the attribute name accordingly. Assumed, you are using `platform` or `audience` in DITA, you need to define `const attributeName` like this:

```javascript
const attributeName = 'data-platform';
// or
const attributeName = 'data-audience';
```

#### Create a Client Library

- Place the JavaScript code into a `.js` file within a client library folder of your AEM project.
- Ensure the client library category is included in the page or component where this functionality is needed.

#### Embedding in a Component

- For direct use within a specific AEM component, include the script tag referencing this JS file at the bottom of the component’s HTML file.
- Alternatively, use AEM’s HTML Template Language (HTL) to conditionally include the script based on component properties.

#### Global Use Across the Site

- To apply this functionality broadly across the site, include the client library in the global page template to ensure the script is loaded on every page where the functionality might be useful.

### Integration into the DITA Open Toolkit (DITA-OT)

#### Customizing the HTML Output

- Modify the DITA-OT HTML5 plugin to include the JavaScript code by adding the script directly to the `common/js` directory within the plugin and referencing it in the plugin’s HTML template files.

#### Plugin Extension

- Create a custom plugin for the DITA Open Toolkit that extends the HTML5 output. Include the script within the resources folder and ensure it’s copied to the output directory during the build process.

#### Build Process

- Ensure that during the build process, the DITA-OT copies the script into the output directory. Adjust the `build.xml` file to include a step that copies the JS file into the out directory.

## Notes

- Test the integration thoroughly in AEM’s author and publish environments, ensuring the script’s functionality harmonizes with content dynamics and user interactions typical in your AEM Sites.
- Consider accessibility and responsiveness in your implementation to maintain an inclusive user experience.
- Keep in mind that modifications to the DITA-OT or its plugins might require maintenance when updating the DITA-OT toolkit version.

This documentation aims to provide a helpful guide to integrating and utilizing the Dynamic Content Highlighting script in various environments, with a focus on enhancing dynamic content navigation and user interaction.
