document.addEventListener('DOMContentLoaded', function() {

    // Define constants for script metadata
    const scriptName = "Dynamic Content Highlighting";
    const scriptVersion = "2024.4.002";

    /**
     * Name: Dynamic Content Highlighting
     * Version: 2024.4.002
     * Shortdesc: Dynamically generates a dropdown from defined attribute values and highlights 
     * matching elements on selection change.
     * Author: Stefan Gentz <gentz@adobe.com>
     * 
     * This script enhances the user experience on a website by introducing a dropdown menu (<select>)
     * that allows users to visually highlight elements based on a custom attribute ('data-rev').
     * It's crafted to enhance dynamic content-driven experiences.
     * The script limits the scope to parsing the descendants of a defined area of webpage.
     * It is self-containing and has no exernal dependencies and is highly customizable
     * Check the documentation below for implementation in AEM Sites and DITA OT.
     *
     * Integration into Adobe Experience Manager (AEM) Sites
     *
     * 1. Create a Client Library:
     *    - Place the JavaScript code into a `.js` file within a client library folder of your AEM project.
     *    - Ensure the client library category is included in the page or component where this functionality is needed.
     *
     * 2. Embedding in a Component:
     *    - For direct use within a specific AEM component, include the script tag referencing this JS file
     *      at the bottom of the component's HTML file.
     *    - Alternatively, use AEM's HTML Template Language (HTL) to conditionally include the script based on component properties.
     *
     * 3. Global Use Across the Site:
     *    - To apply this functionality broadly across the site, include the client library in the global page template.
     *      This ensures the script is loaded on every page where the functionality might be useful.
     *
     * Note:
     * - Test the integration thoroughly in AEM's author and publish environments, ensuring the script's functionality
     *   harmonizes with content dynamics and user interactions typical in your AEM Sites.
     * - Consider accessibility and responsiveness in your implementation to maintain an inclusive user experience.
     *
     * Documentation for Integration into the DITA Open Toolkit
     *
     * 1. Customizing the HTML Output:
     *    - Modify the DITA-OT HTML5 plugin to include the JavaScript code. This can be done by adding the script
     *      directly to the `common/js` directory within the plugin and referencing it in the plugin's HTML template files.
     *
     * 2. Plugin Extension:
     *    - Create a custom plugin for the DITA Open Toolkit that extends the HTML5 output. In your plugin, include
     *      the script within the resources folder and ensure it's copied to the output directory during the build process.
     *
     * 3. Build Process:
     *    - Ensure that during the build process, the DITA-OT copies the script into the output directory. Adjust the
     *      build.xml file to include a step that copies the JS file into the `out` directory.
     *
     * Note:
     * - Keep in mind that modifications to the DITA-OT or its plugins might require maintenance when updating 
     *   the DITA OT toolkit version.
    */
    
    // Base Configuration
    // Here you can define:
    // - The id for the <style> and the <select> elements that will be inserted to the page,
    // - where the dropdown should be inserted,
    // - define the search scope to the descendants of a specific element of the page,
    // - which attribute is used to gather the values for the dropdown,
    // - which class name will be added to the elements to highligh,
    // - define if you want to sort the entries in the <select> dropdown ascending or descending,
    // - define your custom css for styling the <select> dropdown and the matches.
    
    // The id for the custom <style id="foo"> element
    const styleElementID = "dynamicContentStyles";
    const selectElementID = "dynamicContentSelect";
    const selectElementDefaultOptionText = "Select a release …"

    // The <select> dropdown will be inserted as the first child of the element defined here:
    const dropdownTargetPos = document.querySelector('div.topic.section');
    
    // Defines the CSS selector to narrow down the search to specific parts of the webpage.
    const searchScopeElement = 'div';
    const searchScopeID = '';
    const searchScopeClass = 'topic section';
    
    // Name of the attribute used for finding matches:
    const attributeName = 'data-rev';
    const highlightingClassName = `${attributeName}-highlighted`;
    
    // Defines sorting order for dropdown values. Can be 'ascending' or 'descending'
    const sortDirection = 'descending';

    // Generates custom CSS for the dropdown and highlighted elements
    // using dynamic IDs and class names.
    function customHighlightStyling(selectElementID, highlightingClassName) {
        return `
    /*
      Custom CSS for JavaScript "${scriptName}", Version ${scriptVersion}.
      When editing make sure to keep the {variables} prefixed with "$" as
      they will be populated during runtime.
    */
    
    :root {
        --corporate-base-color: rgb(8 117 225);
    }
    
    select#${selectElementID} {
        /* Custom style classes for the dropdown */
    
        /* reset standard select */
        margin: 0;      
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-appearance: none;
        -moz-appearance: none;
    
        /* custom select styling */
        margin-left: 20px;
        margin-right: 0px;
        margin-bottom: 20px;
        float: right;
        background-color: white;
        border: thin solid var(--corporate-base-color);
        border-radius: 5px;
        display: inline-block;
        font: inherit;
        font-weight: bold;
        color: var(--corporate-base-color);
        line-height: 1.5em;
        padding: 0.5em 3.5em 0.5em 1em;
        background-image:
            linear-gradient(45deg, transparent 50%, rgb(255 255 255) 50%),
            linear-gradient(135deg, rgb(255 255 255) 50%, transparent 50%),
            radial-gradient(var(--corporate-base-color) 70%, transparent 72%);
        background-position:
            calc(100% - 20px) calc(1em + 2px),
            calc(100% - 15px) calc(1em + 2px),
            calc(100% - .5em) .5em;
        background-size:
            5px 5px,
            5px 5px,
            1.5em 1.5em;
        background-repeat: no-repeat;
    }
    select#release-select:focus {
        background-image:
            linear-gradient(45deg, white 50%, transparent 50%),
            linear-gradient(135deg, transparent 50%, white 50%),
            radial-gradient(var(--corporate-base-color) 70%, transparent 72%);
        background-position:
            calc(100% - 15px) 1em,
            calc(100% - 20px) 1em,
            calc(100% - .5em) .5em;
        background-size:
            5px 5px,
            5px 5px,
            1.5em 1.5em;
        background-repeat: no-repeat;
        border-color: rgb(8 117 225);
        outline: 0;
    }
    
    /* Styling for highlighting the elements */
    
    .topic .topic :not(.${highlightingClassName}) {
        color: rgb(90, 90, 90);
    }
    
    .${highlightingClassName}, .${highlightingClassName} * {
        color: var(--corporate-base-color) !important;
        font-weight: bold;
    }
    `;
    }
    
    if (dropdownTargetPos) {

        const searchScopeSelector = `${searchScopeElement || ''}${searchScopeID ? `#${searchScopeID}` : ''}${searchScopeClass ? `.${searchScopeClass.split(' ').join('.')}` : ''}`;

        if (searchScopeSelector) {

            // Collects unique attribute values for the defined from defined search scope.
            const attributeValues = new Set();
            document.querySelectorAll(`${searchScopeSelector} [${attributeName}]`).forEach(el => {
                attributeValues.add(el.getAttribute(attributeName));
            });

            if (attributeValues.size > 0) {

                // Check for existing <style> element or create and insert a new one.
                let style = document.head.querySelector(`style#${styleElementID}`);
                if (style) {
                    // Updates existing <style> content
                    style.innerHTML = customHighlightStyling(selectElementID);
                } else {
                    // Create and appended new <style> element
                    style = document.createElement('style');
                    style.id = styleElementID;
                    style.innerHTML = customHighlightStyling(selectElementID);
                    document.head.appendChild(style);
                }

                // Sorts the collected values based on the defined direction.
                const sortedValues = Array.from(attributeValues).sort((a, b) => {
                    if (sortDirection === 'ascending') {
                        return a.localeCompare(b, undefined, {numeric: true});
                    } else {
                        return b.localeCompare(a, undefined, {numeric: true});
                    }
                });

                // Check for existing <select> element or create a new one.
                let select = document.body.querySelector(`select#${selectElementID}`);
                if (select) {
                    // Remove values from existing <select id="selectElementID">
                    while (select.firstChild) {
                        select.removeChild(select.firstChild);
                    };
                    // Add collected unique values to existing <select id="selectElementID">
                    select.appendChild(new Option(`${selectElementDefaultOptionText}`, ''));
                    sortedValues.forEach(value => {
                        select.appendChild(new Option(`${value}`, value));
                    });
                } else {
                    // Create new <select id="selectElementID"> element and populate it
                    select = document.createElement('select');
                    select.id = selectElementID;
                    select.appendChild(new Option(`${selectElementDefaultOptionText}`, ''));
                    sortedValues.forEach(value => {
                        select.appendChild(new Option(`${value}`, value));
                    });
                }

                // Insert <select> element as first child at the defined target position.
                if (dropdownTargetPos) {
                    dropdownTargetPos.insertBefore(select, dropdownTargetPos.firstChild);
                } else {
                    console.error(`Target position "${dropdownTargetPos}" for <select id="${selectElementID}"> element not found. Could not add the element.`);
                }

                // Adds event listener for highlighting matching elements upon selection change.
                select.addEventListener('change', function() {
                    
                    // Removes highlighting class from all elements before adding to new matches.
                    document.querySelectorAll(`.${highlightingClassName}`).forEach(el => {
                        el.classList.remove(highlightingClassName);
                    });

                    // Add highlighting class to the matching elements
                    if (this.value) {
                        // Adds highlighting class to elements matching the selected value.
                        document.querySelectorAll(`${searchScopeSelector} [${attributeName}="${this.value}"]`).forEach(el => {
                            el.classList.add(`${highlightingClassName}`);
                        });
                
                        // Updates custom styling based on current selection
                        style.innerHTML = customHighlightStyling(selectElementID, highlightingClassName);
                    } else {
                        // Resets to default styling if no selection is made
                        style.innerHTML = customHighlightStyling(selectElementID, highlightingClassName);
                    }
                });
            } else {
                console.log(`No matches for attribute "${attributeName}" were found. The dropdown will not be added.`);
            }
        } else {
            console.error('No search scope defined. Please define at least one: element, ID, or class or a combination of it.');
        }
    } else {
        console.error(`The target "${dropdownTargetPos}" could not be found.`);
    }
});