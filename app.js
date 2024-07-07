document.addEventListener('DOMContentLoaded', function() {
    const services = [
        { title: 'Authorization', onCall: 'Radha Sanchez', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Kristinn Pugh', sonarQubeProject: 'Authorization Service', pagerDutyService: 'Authorization Service' },
        { title: 'Order', onCall: 'Michael Molina', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Gary Zhu', sonarQubeProject: 'Order Service', pagerDutyService: 'Awesome Service' },
        { title: 'Shipping', onCall: 'Gary Zhu', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Radha Sanchez', sonarQubeProject: 'Shipping Service', pagerDutyService: 'Shipping Service' },
        { title: 'Fraud Detection', onCall: 'Yuliya Attias', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Radha Sanchez', sonarQubeProject: 'Fraud Detection Service', pagerDutyService: 'Fraud Detection Service' },
        { title: 'Payment', onCall: 'Alexander Ma', runbooks: 2, monitorDashboards: 3, lastCommitter: 'Daniyel Moshe', sonarQubeProject: 'Payment Service', pagerDutyService: 'Payment Service' },
        { title: 'Admin', onCall: 'Anton Sitwat', runbooks: 2, monitorDashboards: 1, lastCommitter: 'Anton Sitwat', sonarQubeProject: 'Admin Service', pagerDutyService: 'Admin Service' },
    ];

    const tableContainer = document.querySelector('#services-table');
    const tableBody = tableContainer.querySelector('tbody');
    const searchInput = document.querySelector('.search-filter input');
    const viewButtons = document.querySelectorAll('.view-controls button');
    let currentView = 'table';

    function renderTable(data) {
        if (currentView === 'table') {
            tableBody.innerHTML = '';
            data.forEach(service => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${service.title}</td>
                    <td><img src="https://via.placeholder.com/30" alt="${service.onCall}" title="${service.onCall}" class="avatar"></td>
                    <td><i class="fas fa-book"></i> <i class="fas fa-book"></i></td>
                    <td><i class="fas fa-chart-line"></i> <i class="fas fa-fire"></i> <i class="fas fa-exclamation-triangle"></i></td>
                    <td><img src="https://via.placeholder.com/30" alt="${service.lastCommitter}" title="${service.lastCommitter}" class="avatar"></td>
                    <td>${service.sonarQubeProject}</td>
                    <td>${service.pagerDutyService}</td>
                    <td><button class="more-options"><i class="fas fa-ellipsis-h"></i></button></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableContainer.innerHTML = '';
            data.forEach(service => {
                const card = document.createElement('div');
                card.className = 'service-card';
                card.innerHTML = `
                    <h3>${service.title}</h3>
                    <p>On Call: ${service.onCall}</p>
                    <p>Last Committer: ${service.lastCommitter}</p>
                    <p>SonarQube: ${service.sonarQubeProject}</p>
                    <p>PagerDuty: ${service.pagerDutyService}</p>
                `;
                tableContainer.appendChild(card);
            });
        }
    }

    function filterServices(searchTerm) {
        return services.filter(service => 
            Object.values(service).some(value => 
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedSearch = debounce((searchTerm) => {
        const filteredServices = filterServices(searchTerm);
        renderTable(filteredServices);
    }, 300);

    searchInput.addEventListener('input', function() {
        debouncedSearch(this.value);
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            tableContainer.className = currentView + '-view';
            renderTable(services);
        });
    });

    // Initial render
    renderTable(services);
});