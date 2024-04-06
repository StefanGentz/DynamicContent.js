document.addEventListener('DOMContentLoaded', function() {

    // Define constants for script metadata
    const scriptMetadata = {
        name: "Dynamic Content Highlighting",
        version: "2024.4.006"
    };
    /**
     * Name: Dynamic Content Highlighting
     * Version: 2024.4.006
     * Shortdesc: Dynamically generates a dropdown from defined attribute values and highlights.
     * matching elements on selection change.
     * 
     * Author: Stefan Gentz <gentz@adobe.com>
     * 
     * This script enhances the user experience on a website by introducing a dropdown menu (<select>)
     * that allows users to visually highlight elements based on a custom attribute (e.g., 'data-rev').
     * It's crafted to enhance dynamic content-driven experiences.
     * The script limits the scope to parsing the descendants of a defined area of a webpage.
     * It is self-containing, has no external dependencies, and is highly customizable
     * Check the documentation below for implementation in AEM Sites and DITA OT.
     *
     * See the readme.md on https://github.com/StefanGentz/DynamicContent.js
    */
    
    // Base Configuration
    // Here you can define:
    // - The id for the <style> and the <select> elements that will be inserted to the page,
    // - where the dropdown should be inserted,
    // - define the search scope to the descendants of a specific element of the page,
    // - which attribute is used to gather the values for the dropdown,
    // - which class name will be added to the elements to highlight,
    // - define if you want to sort the entries in the <select> dropdown ascending or descending,
    // - define your custom css for styling the <select> dropdown and the matches.
    
    const config = {
        styleElementID: "dynamicContentStyles",
        selectElementID: "dynamicContentSelect",
        selectElementDefaultText: "Select a release …",
        dropdownTargetSelector: 'div.topic.section',
        searchScopeSelector: 'div.topic.section',
        attributeName: 'data-rev',
        highlightingClass: `data-rev-highlighted`,
        sortDirection: 'descending'
    };

    (function() {
        function customHighlightStyling(selectElementID, highlightingClass) {
        // Generates custom CSS for the dropdown and highlighted elements
        // using dynamic IDs and class names.
            return `
            /*
            Custom CSS for JavaScript "${scriptMetadata.name}", Version ${scriptMetadata.version}.
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
            
            .topic .topic :not(.${highlightingClass}) {
                /* Could be used in a future version to format the rest of the topic in, e.g., gray, to make the highlighted text stand out more */ 
                /* color: rgb(90, 90, 90); */
            }
            
            .${highlightingClass}, .${highlightingClass} * {
                color: var(--corporate-base-color) !important;
                font-weight: bold;
            }`;
        };

        function createOrUpdateStyleElement() {
            let styleElement = document.head.querySelector(`style#${config.styleElementID}`);
            if (styleElement) {
                styleElement.innerHTML = customHighlightStyling(config.selectElementID, config.highlightingClass);
            } else {
                styleElement = document.createElement('style');
                styleElement.id = config.styleElementID;
                styleElement.innerHTML = customHighlightStyling(config.selectElementID, config.highlightingClass);
                document.head.appendChild(styleElement);
            }
            return styleElement;
        };

        function collectAndSortAttributeValues(searchScopeSelector) {
            const attributeValues = new Set();
            document.querySelectorAll(`${searchScopeSelector} [${config.attributeName}]`).forEach(el => {
                attributeValues.add(el.getAttribute(config.attributeName));
            });
            const sortedValues = Array.from(attributeValues).sort((a, b) => {
                if (config.sortDirection === 'ascending') {
                    return a.localeCompare(b, undefined, {numeric: true});
                } else {
                    return b.localeCompare(a, undefined, {numeric: true});
                }
            });
            return sortedValues;
        };

        function createOrUpdateSelectElement(sortedValues) {
            let selectElement = document.body.querySelector(`select#${config.selectElementID}`);
            if (selectElement) {
                while (selectElement.firstChild) { selectElement.removeChild(selectElement.firstChild); }
            } else {
                selectElement = document.createElement('select');
                selectElement.id = config.selectElementID;
                const dropdownTargetPos = document.querySelector(config.dropdownTargetSelector);
                dropdownTargetPos.insertBefore(selectElement, dropdownTargetPos.firstChild);
            }
            selectElement.append(new Option(config.selectElementDefaultText, ''));
            sortedValues.forEach(value => {
                selectElement.append(new Option(value, value));
            });
            
            return selectElement;
        };

        function addEventListenerToSelectElement(styleElement, selectElement, searchScopeSelector) {
            selectElement.addEventListener('change', function() {
                document.querySelectorAll(`.${config.highlightingClass}`).forEach(el => el.classList.remove(config.highlightingClass));
                if (this.value) {
                    document.querySelectorAll(`${searchScopeSelector} [${config.attributeName}="${this.value}"]`).forEach(el => el.classList.add(config.highlightingClass));
                }
                styleElement.innerHTML = customHighlightStyling(config.selectElementID, config.highlightingClass);
            });
        };

        function main() {
            if (config.dropdownTargetSelector) {

                const dropdownTargetPos = document.querySelector(config.dropdownTargetSelector);

                if (dropdownTargetPos) {
                    const searchScopeSelector = config.searchScopeSelector;
                    if (searchScopeSelector) {
                        let sortedValues = collectAndSortAttributeValues(searchScopeSelector);
                        if (sortedValues.length > 0) {
                            let styleElement = createOrUpdateStyleElement ();
                            let selectElement = createOrUpdateSelectElement(sortedValues);
                            addEventListenerToSelectElement(styleElement, selectElement, searchScopeSelector);
                        } else {
                            console.info(`No matches for attribute "${config.attributeName}" were found. The dropdown will not be added.`);
                        }
                    } else {
                        console.error('No search scope defined. Please define at least one: element, ID, or class or a combination of it.');
                    }
                } else {
                    console.error(`The target position "${config.dropdownTargetSelector}" for <select id="${config.selectElementID}"> element not found. Could not add the element.`);
                }
            };
        };

        main();
    })();
});
