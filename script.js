
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
    //generateJobListings();
}

const jobList = $("#job-list");
function sort()
{
    for(var i=0;i<jobData.length;i++)
    {
        for(var j=i+1;j<jobData.length;j++)
        {
            if(jobData[j].new && jobData[j].featured)
            {
                var temp=jobData[i];
                jobData[i]=jobData[j];
                jobData[j]=temp;
            }
            else if(jobData[j].featured)
            {
                if(!jobData[i].featured)
                {
                    var temp=jobData[i];
                    jobData[i]=jobData[j];
                    jobData[j]=temp;
                }
            }
            else if(jobData[j].new)
            {
                if(!jobData[i].new && !jobData[i].featured)
                {
                    var temp=jobData[i];
                    jobData[i]=jobData[j];
                    jobData[j]=temp;
                }
            }
        }
    }
}

async function generateJobListings() {
    sort();
    $("#job-list").html("");
    jobData.forEach(job => {
        const listItem = $("<li>").addClass("job-item");
        if(job.featured && job.new)
        {
            listItem.addClass("featured-job");
        }


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
    const filterTags = selectedTagsContainer.children().map(function () {
        return this.id;
    }).get();
    if(filterTags.length==0){
        $(".filter-bar").css("display","none");
        generateJobListings();
    }
    else
        generateFilteredJobListings(filterTags);
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


    if (logo == "" || title == "" || company == "" || days == "" || location == "" || jobType == "" || languages.length == 0 || tools.length ==0  || level == "" || role == "") {
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
    // Add the new listing to the jobData array
    jobData.push(listing);
  
;
   
    $("#add-job-modal").css("display", "none");
    $("#imageLink").val("");
    $("#jobTitle").val("");
    $("#isNew").prop("checked", false);
    $("#isFeatured").prop("checked", false);
    $("#companyName").val("");
    $("#days").val("");
    $("#location").val("");
    $("#jobType").val("");
    $("#languages").val("");
    $("#tools").val("");
    $("#level").val("");
    $("#role").val("");
    generateJobListings();
});

const filterInput = $("#filterInput");
const selectedTagsContainer = $("#selectedTags");


jobList.on("click", "span", function () {
    const clickedTag = $(this).text();
    addTagToSearchBar(clickedTag);
});


function addTagToSearchBar(tag) {
    var flag = false;
    $(".filter-bar").css("display","flex");
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
            <button onclick="removeTag('${tag}')" class="remove-tag"><img src="images/icon-remove.svg"></button>
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
    $(".filter-bar").css("display","none");
    generateJobListings();
}
// Function to remove a tag from the search bar
function removeTag(tag) {
    $(`#${tag}`).remove();
    const filterTags = selectedTagsContainer.children().map(function () {
        return this.id;
    }).get();
    if(filterTags.length==0){
        $(".filter-bar").css("display","none");
        generateJobListings();
    }
    else
        generateFilteredJobListings(filterTags);
}

// Function to generate filtered job listings
function generateFilteredJobListings(filterTags) {


        sort();
        const filteredListings = jobData.filter(job => {
            return (
                filterTags.every(tag=>{
                return(    
                    job.role==tag||
                    job.level==tag||
                    job.languages.includes(tag)||
                    job.tools.includes(tag)
                )})
            )
        });

        $("#job-list").html("");
        filteredListings.forEach(job => {
            const listItem = $("<li>").addClass("job-item");
            if(job.featured && job.new)
            {
                listItem.addClass("featured-job");
            }

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

// Function to show job details in a popup when a job title is clicked
function showJobDetails(job) {
    const jobDetailsModal = $("#job-details-modal");

    // Create the HTML structure for job details
    const jobDetailsHTML = `
        <div class="modal-content">
            <span class="close-popup" onclick="closeJobDetails()">&times;</span>
            <h2>${job.company}</h2>
            <h3>${job.position}</h3>
            <h3>Location: ${job.location}<h3>
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
//document .ready
$(document).ready(async function(){
await getJobs();
generateJobListings();
});
