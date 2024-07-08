document.addEventListener('DOMContentLoaded', function() {
    // Sample data for services
    const services = Array.from({ length: 50 }, (_, i) => ({
        title: `Service ${i + 1}`,
        onCall: ['Wao Wu', 'DK Nguyen', 'Alexander Van', 'Vitor Thang', 'Don Tuan', 'Le Vinh'][Math.floor(Math.random() * 6)],
        runbooks: Math.floor(Math.random() * 5) + 1,
        monitorDashboards: Math.floor(Math.random() * 5) + 1,
        lastCommitter: ['Wao Wu', 'DK Nguyen', 'Alexander Van', 'Vitor Thang', 'Don Tuan', 'Le Vinh'][Math.floor(Math.random() * 5)],
        sonarQubeProject: `Service ${i + 1} Project`,
        pagerDutyService: `Service ${i + 1} PD`
    }));

    // Sample data for recent activities
    const activities = [
        { type: 'deployment', service: 'Authorization', status: 'success', time: '10 minutes ago' },
        { type: 'security', service: 'Payment', status: 'warning', time: '1 hour ago' },
        { type: 'incident', service: 'Order', status: 'resolved', time: '3 hours ago' },
        { type: 'compliance', service: 'All', status: 'audit', time: '1 day ago' }
    ];

    // Sample merge request data
    const mergeRequests = [
        { id: 'DSO-001', title: 'Implement new authentication flow', author: 'Alice Chen', status: 'Open', branch: 'feature/auth-flow', commits: 5 },
        { id: 'DSO-002', title: 'Optimize database queries', author: 'Bob Smith', status: 'Open', branch: 'performance/db-queries', commits: 3 },
        { id: 'DSO-003', title: 'Update dependencies', author: 'Charlie Brown', status: 'Open', branch: 'chore/update-deps', commits: 1 },
    ];

    // Handle options menu
    const optionsMenu = document.querySelector('.options-menu');
    let activeOptionsButton = null;

    function showOptionsMenu(button) {
        const rect = button.getBoundingClientRect();
        optionsMenu.style.display = 'block';
        optionsMenu.style.top = `${rect.bottom + window.scrollY}px`;
        optionsMenu.style.left = `${rect.left + window.scrollX}px`;
        activeOptionsButton = button;
    }

    function hideOptionsMenu() {
        optionsMenu.style.display = 'none';
        activeOptionsButton = null;
    }

    document.addEventListener('click', function(event) {
        const moreOptionsButton = event.target.closest('.more-options');
        if (moreOptionsButton) {
            event.stopPropagation();
            if (activeOptionsButton === moreOptionsButton) {
                hideOptionsMenu();
            } else {
                showOptionsMenu(moreOptionsButton);
            }
        } else if (!optionsMenu.contains(event.target)) {
            hideOptionsMenu();
        }
    });

    optionsMenu.addEventListener('click', function(event) {
        const action = event.target.closest('li');
        if (action) {
            const actionType = action.classList[0];
            const serviceRow = activeOptionsButton.closest('tr');
            const serviceName = serviceRow.querySelector('td').textContent;

            switch(actionType) {
                case 'refresh':
                    console.log(`Refreshing ${serviceName}`);
                    // Add refresh logic here
                    break;
                case 'edit':
                    console.log(`Editing ${serviceName}`);
                    // Add edit logic here
                    break;
                case 'delete':
                    console.log(`Deleting ${serviceName}`);
                    // Add delete logic here
                    break;
            }

            hideOptionsMenu();
        }
    });

    // Handle dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Pagination variables
    let currentPage = 1;
    let itemsPerPage = 10;

    // Render services with pagination
    function renderServices(page = 1) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedServices = services.slice(startIndex, endIndex);

        const tableBody = document.querySelector('#services-table tbody');
        tableBody.innerHTML = paginatedServices.map(service => `
            <tr>
                <td>${service.title}</td>
                <td>${service.onCall}</td>
                <td>${'<i class="fas fa-book"></i>'.repeat(service.runbooks)}</td>
                <td>${'<i class="fas fa-chart-line"></i>'.repeat(service.monitorDashboards)}</td>
                <td>${service.lastCommitter}</td>
                <td>${service.sonarQubeProject}</td>
                <td>${service.pagerDutyService}</td>
                <td><button class="more-options"><i class="fas fa-ellipsis-h"></i></button></td>
            </tr>
        `).join('');

        renderPagination();
    }

    // Render pagination controls
    function renderPagination() {
        const totalPages = Math.ceil(services.length / itemsPerPage);
        const paginationContainer = document.querySelector('.pagination') || document.createElement('div');
        paginationContainer.className = 'pagination';

        paginationContainer.innerHTML = `
            <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
            <select id="items-per-page">
                <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10 per page</option>
                <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25 per page</option>
                <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50 per page</option>
            </select>
        `;

        if (!document.querySelector('.pagination')) {
            document.querySelector('.my-services').appendChild(paginationContainer);
        }

        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderServices(currentPage);
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderServices(currentPage);
            }
        });

        document.getElementById('items-per-page').addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1;
            renderServices(currentPage);
        });
    }

    // Render recent activities
    function renderActivities() {
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = activities.map(activity => `
            <li class="activity-item">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
                <div class="activity-details">
                    <span class="activity-service">${activity.service}</span>
                    <span class="activity-status ${activity.status}">${activity.status}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </li>
        `).join('');
    }

    function getActivityIcon(type) {
        switch(type) {
            case 'deployment': return 'rocket';
            case 'security': return 'shield-alt';
            case 'incident': return 'exclamation-triangle';
            case 'compliance': return 'clipboard-check';
            default: return 'info-circle';
        }
    }

    // Implement search functionality
    const searchInput = document.querySelector('.search-filter input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredServices = services.filter(service => 
            Object.values(service).some(value => 
                value.toString().toLowerCase().includes(searchTerm)
            )
        );
        renderFilteredServices(filteredServices);
    });

    function renderFilteredServices(filteredServices) {
        const tableBody = document.querySelector('#services-table tbody');
        tableBody.innerHTML = filteredServices.map(service => `
            <tr>
                <td>${service.title}</td>
                <td>${service.onCall}</td>
                <td>${'<i class="fas fa-book"></i>'.repeat(service.runbooks)}</td>
                <td>${'<i class="fas fa-chart-line"></i>'.repeat(service.monitorDashboards)}</td>
                <td>${service.lastCommitter}</td>
                <td>${service.sonarQubeProject}</td>
                <td>${service.pagerDutyService}</td>
                <td><button class="more-options"><i class="fas fa-ellipsis-h"></i></button></td>
            </tr>
        `).join('');
    }

    // User menu toggle
    document.querySelector('.user-icon').addEventListener('mouseover', function() {
        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'block';
    });

    document.querySelector('.user-dropdown').addEventListener('mouseleave', function() {
        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'none';
    });

    // Deploy popup
    const deployButton = document.querySelector('.action-btn');
    const deployPopup = document.getElementById('deploy-popup');
    const deployCancel = document.getElementById('deploy-cancel');
    const deployForm = document.getElementById('deploy-form');

    deployButton.addEventListener('click', function() {
        deployPopup.classList.add('show');
    });

    deployCancel.addEventListener('click', function() {
        deployPopup.classList.remove('show');
    });

    deployForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Add deployment logic here
        console.log('Deploying with the following data:');
        const formData = new FormData(deployForm);
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        deployPopup.classList.remove('show');
    });

    // Populate Services Dropdown
    const servicesDropdown = document.getElementById('services');
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.title;
        option.textContent = service.title;
        servicesDropdown.appendChild(option);
    });

    // Dynamic Resource Dropdown
    const componentSelect = document.getElementById('component');
    const resourceSelect = document.getElementById('resource');

    const resources = {
        Infrastructure: ['All-In-One', 'EKS', 'VPC', 'EC2', 'S3', 'RDS'],
        Pipeline: ['CICD', 'ArgoCD App', 'CI']
    };

    componentSelect.addEventListener('change', function() {
        const selectedComponent = componentSelect.value;
        resourceSelect.innerHTML = '<option value="">Select Resource</option>';
        if (selectedComponent && resources[selectedComponent]) {
            resources[selectedComponent].forEach(resource => {
                const option = document.createElement('option');
                option.value = resource;
                option.textContent = resource;
                resourceSelect.appendChild(option);
            });
        }
    });

    // Merge Request Popup
    const mergeButton = document.querySelector('.action-btn:nth-child(2)');
    const mergePopup = document.getElementById('merge-popup');
    const mergeClose = document.getElementById('merge-close');
    const mergeList = document.querySelector('.merge-list');

    function renderMergeRequests() {
        mergeList.innerHTML = mergeRequests.map(mr => `
            <div class="merge-item">
                <div class="merge-header">
                    <span class="merge-id">${mr.id}</span>
                    <span class="merge-status ${mr.status.toLowerCase()}">${mr.status}</span>
                </div>
                <h3 class="merge-title">${mr.title}</h3>
                <div class="merge-details">
                    <span><i class="fas fa-user"></i> ${mr.author}</span>
                    <span><i class="fas fa-code-branch"></i> ${mr.branch}</span>
                    <span><i class="fas fa-code-commit"></i> ${mr.commits} commits</span>
                </div>
                <div class="merge-actions">
                    <button class="merge-action approve">Approve</button>
                    <button class="merge-action review">Review</button>
                </div>
            </div>
        `).join('');
    }

    mergeButton.addEventListener('click', function() {
        mergePopup.classList.add('show');
        renderMergeRequests();
    });

    mergeClose.addEventListener('click', function() {
        mergePopup.classList.remove('show');
    });

    // Close popup when clicking outside
    mergePopup.addEventListener('click', function(event) {
        if (event.target === mergePopup) {
            mergePopup.classList.remove('show');
        }
    });

    // Initial render
    renderServices();
    renderActivities();
});