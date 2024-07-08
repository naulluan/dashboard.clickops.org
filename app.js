document.addEventListener('DOMContentLoaded', function() {
    // Sample data for services
    const services = [
        { title: 'Authorization', onCall: 'Radha Sanchez', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Kristinn Pugh', sonarQubeProject: 'Authorization Service', pagerDutyService: 'Authorization Service' },
        { title: 'Order', onCall: 'Michael Molina', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Gary Zhu', sonarQubeProject: 'Order Service', pagerDutyService: 'Awesome Service' },
        { title: 'Shipping', onCall: 'Gary Zhu', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Radha Sanchez', sonarQubeProject: 'Shipping Service', pagerDutyService: 'Shipping Service' },
        { title: 'Fraud Detection', onCall: 'Yuliya Attias', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Radha Sanchez', sonarQubeProject: 'Fraud Detection Service', pagerDutyService: 'Fraud Detection Service' },
        { title: 'Payment', onCall: 'Alexander Ma', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Daniyel Moshe', sonarQubeProject: 'Payment Service', pagerDutyService: 'Payment Service' },
        { title: 'Admin', onCall: 'Anton Sitwat', runbooks: 2, monitorDashboards: 1, lastCommitter: 'Anton Sitwat', sonarQubeProject: 'Admin Service', pagerDutyService: 'Admin Service' },
    ];

    // Sample data for recent activities
    const activities = [
        { type: 'deployment', service: 'Authorization', status: 'success', time: '10 minutes ago' },
        { type: 'security', service: 'Payment', status: 'warning', time: '1 hour ago' },
        { type: 'incident', service: 'Order', status: 'resolved', time: '3 hours ago' },
        { type: 'compliance', service: 'All', status: 'audit', time: '1 day ago' }
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
        if (event.target.closest('.more-options')) {
            event.stopPropagation();
            const button = event.target.closest('.more-options');
            if (activeOptionsButton === button) {
                hideOptionsMenu();
            } else {
                showOptionsMenu(button);
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

    function renderServices() {
        const tableBody = document.querySelector('#services-table tbody');
        tableBody.innerHTML = services.map(service => `
            <tr>
                <td>${service.title}</td>
                <td>${service.onCall}</td>
                <td><i class="fas fa-book"></i> <i class="fas fa-book"></i></td>
                <td><i class="fas fa-chart-line"></i> <i class="fas fa-fire"></i> <i class="fas fa-exclamation-triangle"></i></td>
                <td>${service.lastCommitter}</td>
                <td>${service.sonarQubeProject}</td>
                <td>${service.pagerDutyService}</td>
                <td><button class="more-options"><i class="fas fa-ellipsis-h"></i></button></td>
            </tr>
        `).join('');
    }

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
                <td><i class="fas fa-book"></i> <i class="fas fa-book"></i></td>
                <td><i class="fas fa-chart-line"></i> <i class="fas fa-fire"></i> <i class="fas fa-exclamation-triangle"></i></td>
                <td>${service.lastCommitter}</td>
                <td>${service.sonarQubeProject}</td>
                <td>${service.pagerDutyService}</td>
                <td><button class="more-options"><i class="fas fa-ellipsis-h"></i></button></td>
            </tr>
        `).join('');
    }

    document.querySelector('.user-icon').addEventListener('mouseover', function() {
        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'block';
    });

    document.querySelector('.user-dropdown').addEventListener('mouseleave', function() {
        const userMenu = document.querySelector('.user-menu');
        userMenu.style.display = 'none';
    });

    document.addEventListener('click', function(event) {
        if (!optionsMenu.contains(event.target) && !event.target.closest('.more-options')) {
            hideOptionsMenu();
        }
    });

    renderServices();
    renderActivities();
});
