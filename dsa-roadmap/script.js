document.addEventListener('DOMContentLoaded', () => {
    const topicHeaders = document.querySelectorAll('.topic-header');

    topicHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;

            // Toggle the 'active' class
            section.classList.toggle('active');

            // Handling maxHeight for smooth transition
            const content = section.querySelector('.topic-content');
            if (section.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = 0;
            }
        });
    });

    // Open the first topic by default
    /*
    const firstSection = document.querySelector('.topic-section');
    if (firstSection) {
        firstSection.classList.add('active');
        const content = firstSection.querySelector('.topic-content');
        if (content) content.style.maxHeight = content.scrollHeight + "px";
    }
    */
    // Actually, user wants "2-3 topics visible", so maybe open all or let them stay open?
    // "that topics should be collapse, and can be opend" implies they might start collapsed or expanded.
    // Let's start with them Expanded by default (except maybe if too many?) 
    // or start collapsed? "visible in one go" suggests compactness.
    // Let's toggle `active` class means OPEN.
    // Let's default to OPEN for all, so users see content immediately, but can close them.
    // Or default closed? User said "2-3 topics should be visible in one go". Content of 2-3 topics?
    // "currently there are big fonts".
    // I'll make them all expanded by default but compact.

    document.querySelectorAll('.topic-section').forEach(section => {
        section.classList.add('active');
        const content = section.querySelector('.topic-content');
        if (content) content.style.maxHeight = content.scrollHeight + "px";
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const viewToggle = document.getElementById('viewToggle');
    const practiceView = document.getElementById('practice-view');
    const companyView = document.getElementById('company-view');
    const labelPractice = document.getElementById('label-practice');
    const labelCompany = document.getElementById('label-company');

    if (viewToggle) {
        viewToggle.addEventListener('change', () => {
            if (viewToggle.checked) {
                // Show Company Archive
                practiceView.style.display = 'none';
                companyView.style.display = 'block';
                labelPractice.classList.remove('active');
                labelCompany.classList.add('active');
            } else {
                // Show Practice Topics
                practiceView.style.display = 'block';
                companyView.style.display = 'none';
                labelPractice.classList.add('active');
                labelCompany.classList.remove('active');
            }
        });
    }
});
