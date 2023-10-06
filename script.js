
var jobData = [];

async function getJobs() {
    // await fetch("data.json").then(response => {
    //     return response.json();
    // }).then(data => {
    //     jobData = data;
    // });
    await $.get("data.json", function (data) {
        
        jobData = data;
    });
}

const jobList = $("#job-list");

// Function to generate job listings from JSON data
async function generateJobListings() {
    if (jobData.length === 0)
        await getJobs();
    $("#job-list").html("");
    jobData.forEach(job => {
        const listItem = $("<li>").addClass("job-item");

        // Create the HTML structure for each job listing
        listItem.html(`
            <img src="${job.logo}" alt="${job.company} Logo">
            <div class="job-details">
                <div class="company-info">
                    <h2>${job.company}</h2>
                    ${job.new ? '<div class="new">New!</div>' : ''}
                    ${job.featured ? '<div class="featured">Featured</div>' : ''}
                </div>
                <h3>${job.position}</h3>
                <ul class="job-meta">
                    <li>${job.postedAt}</li>
                    <li>${job.contract}</li>
                    <li>${job.location}</li>
                </ul>
            </div>
            <div class="job-tags">
                <span>${job.role}</span>
                <span>${job.level}</span>
                ${job.languages.map(language => `<span>${language}</span>`).join('')}
                ${job.tools.map(tool => `<span>${tool}</span>`).join('')}
            </div>
            <button class="close-icon" onclick="deleteJob(${jobData.indexOf(job)})">&times;</button>
        `);

        jobList.append(listItem);
    });
}

function deleteJob(index) {
    jobData.splice(index, 1);
    $("#job-list").html("");
    generateJobListings();
}

// Call the function to generate job listings
// Select elements using jQuery
const addJob = $("#add-job-button");
const close = $("#close-add-job-button");
const add = $("#add");

// Add click event handlers using jQuery
addJob.on("click", () => {
    $("#add-job-modal").css("display", "flex");
});

close.on("click", () => {
    $("#add-job-modal").css("display", "none");
});

add.on("click", () => {
    const logo = $("#imageLink").val();
    const title = $("#jobTitle").val();
    const isNew = $("#isNew").prop("checked");
    const isFeatured = $("#isFeatured").prop("checked");
    const company = $("#companyName").val();
    const days = $("#days").val();
    const location = $("#location").val();
    const jobType = $("#jobType").val();
    const languages = $("#languages").val().split(",");
    const tools = $("#tools").val().split(",");
    const level=$("#level").val();
    const role=$("#role").val();


    if (logo == "" || title == "" || company == "" || days == "" || location == "" || jobType == "" || languages == "") {
        alert("Please fill all the fields");
        return;
    }

    // Create a new job listing object
    const listing = {
        logo: logo,
        company: company,
        new: isNew,
        featured: isFeatured,
        position: title,
        postedAt: days,
        contract: jobType,
        location: location,
        languages: languages,
        tools: tools,
        level:level,
        role:role
    };
    console.log(listing);
    // Add the new listing to the jobData array
    jobData.push(listing);

    // Close the modal and regenerate job listings
    $("#add-job-modal").css("display", "none");
    generateJobListings();
});

const filterInput = $("#filterInput");
const selectedTagsContainer = $("#selectedTags");

// Listen for clicks on job tags
jobList.on("click", "span", function () {
    const clickedTag = $(this).text();
    addTagToSearchBar(clickedTag);
});


function addTagToSearchBar(tag) {
    var flag = false;
    const childrens = $(selectedTagsContainer).children().toArray();
    childrens.forEach(child => {
        if (child.id == tag) {
            alert("Tag already added");
            flag = true;
            return;
        }
    });
    if (flag)
        return;
    
    const clearButton = $("#clear-button");
    console.log(clearButton.length);
    const html=`<div class="clear-button"><button id="clear-button" onclick="clearTags()">Clear</button></div>`;
    if(clearButton.length==0){
        const filter=$("#filter-bar");
        filter.append(html);
    }
    
    const tagElement = $('<div>')
        .addClass('selected-tag')
        .attr('id', tag)
        .html(`
            <span>${tag}</span>
            <button onclick="removeTag('${tag}')" class="remove-tag">×</button>
        `);

    // Append the tag to the selected tags container
    selectedTagsContainer.append(tagElement);

    // Update the filter input value with the selected tags
    filterInput.val(filterInput.val() + ',' + tag);

    // Regenerate job listings based on selected tags
    const filterTags = selectedTagsContainer.children().map(function () {
        return this.id;
    }).get();
    generateFilteredJobListings(filterTags);
}
function clearTags()
{
    selectedTagsContainer.html("");
    $("#clear-button").remove();
    filterInput.val("");
    generateJobListings();
}
// Function to remove a tag from the search bar
function removeTag(tag) {
    $(`#${tag}`).remove();
    const filterTags = selectedTagsContainer.children().map(function () {
        return this.id;
    }).get();
    if(filterTags.length==0)
        generateJobListings();
    else
        generateFilteredJobListings(filterTags);
}

// Function to generate filtered job listings
function generateFilteredJobListings(filterTags) {
    if (jobData.length === 0)
        getJobs().then(() => generateFilteredJobListings(filterTags));
    else {
        const filteredListings = jobData.filter(job => {
            return (
                filterTags.includes(job.role) ||
                filterTags.includes(job.level) ||
                job.languages.some(language => filterTags.includes(language)) ||
                job.tools.some(tool => filterTags.includes(tool))
            );
        });

        $("#job-list").html("");
        filteredListings.forEach(job => {
            const listItem = $("<li>").addClass("job-item");

            // Create the HTML structure for each job listing
            listItem.html(`
                <img src="${job.logo}" alt="${job.company} Logo">
                <div class="job-details">
                    <div class="company-info">
                        <h2>${job.company}</h2>
                        ${job.new ? '<div class="new">New!</div>' : ''}
                        ${job.featured ? '<div class="featured">Featured</div>' : ''}
                    </div>
                    <h3>${job.position}</h3>
                    <ul class="job-meta">
                        <li>${job.postedAt}</li>
                        <li>${job.contract}</li>
                        <li>${job.location}</li>
                    </ul>
                </div>
                <div class="job-tags">
                    <span>${job.role}</span>
                    <span>${job.level}</span>
                    ${job.languages.map(language => `<span>${language}</span>`).join('')}
                    ${job.tools.map(tool => `<span>${tool}</span>`).join('')}
                </div>
                <button class="close-icon" onclick="deleteJob(${jobData.indexOf(job)})">&times;</button>
            `);

            jobList.append(listItem);
        });
    }
}
// Function to show job details in a popup when a job title is clicked
function showJobDetails(job) {
    const jobDetailsModal = $("#job-details-modal");

    // Create the HTML structure for job details
    const jobDetailsHTML = `
        <div class="modal-content">
            <span class="close-popup" onclick="closeJobDetails()">&times;</span>
            <h2>${job.company}</h2>
            <h3>${job.position}</h3>
            <p>Location: ${job.location}</p>
            <p>Description: Lorum ipsemmmmmmmmmm</p>
        </div>
    `;

    // Set the HTML content of the job details modal
    jobDetailsModal.html(jobDetailsHTML);

    // Display the job details popup
    jobDetailsModal.css("display", "block");
}


// Function to close the job details popup
function closeJobDetails() {
    const jobDetailsModal = $("#job-details-modal");
    jobDetailsModal.css("display", "none");
}

// Attach a click event handler to job titles
jobList.on("click", "h3", function () {
    const jobIndex = $(this).closest("li").index();
    const job = jobData[jobIndex];
    showJobDetails(job);
});

generateJobListings();
