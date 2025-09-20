// IntelliFence - Smart Power Line Monitoring & Illegal Electrification Prevention System
// JavaScript for interactive dashboard and animations

class IntelliFenceSystem {
    constructor() {
        this.isSimulationRunning = false;
        this.simulationInterval = null;
        this.alertCount = 0;
        this.deviceCount = 12;
        this.currentValue = 15.2;
        this.voltageValue = 230.5;
        this.powerValue = 3.5;
        
        // Multi-fence system data
        this.currentFence = 'fence-a';
        this.fenceData = {
            'fence-a': {
                name: 'Fence A - Trivandrum North',
                location: 'Zone: North Kerala | Grid ID: TVM-001',
                status: 'online',
                deviceCount: 12,
                current: 15.2,
                voltage: 230.5,
                power: 3.5,
                uptime: '15h 42m',
                cpuUsage: 23,
                memoryUsage: 67,
                temperature: 42,
                alerts: {
                    critical: 0,
                    warning: 1,
                    info: 2
                }
            },
            'fence-b': {
                name: 'Fence B - Kochi Industrial',
                location: 'Zone: Central Kerala | Grid ID: EKM-002',
                status: 'online',
                deviceCount: 14,
                current: 18.7,
                voltage: 240.2,
                power: 4.8,
                uptime: '22h 15m',
                cpuUsage: 31,
                memoryUsage: 72,
                temperature: 45,
                alerts: {
                    critical: 0,
                    warning: 2,
                    info: 1
                }
            },
            'fence-c': {
                name: 'Fence C - Kozhikode Rural',
                location: 'Zone: North Kerala | Grid ID: CLT-003',
                status: 'critical',
                deviceCount: 11,
                current: 22.1,
                voltage: 225.8,
                power: 5.2,
                uptime: '8h 23m',
                cpuUsage: 45,
                memoryUsage: 81,
                temperature: 52,
                alerts: {
                    critical: 1,
                    warning: 0,
                    info: 1
                }
            },
            'fence-d': {
                name: 'Fence D - Kannur Coastal',
                location: 'Zone: North Kerala | Grid ID: KNR-004',
                status: 'online',
                deviceCount: 13,
                current: 14.8,
                voltage: 235.1,
                power: 3.9,
                uptime: '45h 12m',
                cpuUsage: 19,
                memoryUsage: 58,
                temperature: 38,
                alerts: {
                    critical: 0,
                    warning: 0,
                    info: 3
                }
            }
        };
        
        // Global alerts panel state
        this.globalAlertsPanelOpen = false;
        
        // Enhanced parameters for all metrics
        this.previousCurrent = 14.8;
        this.previousVoltage = 229.8;
        this.previousPower = 3.4;
        
        // System parameters
        this.systemUptime = { hours: 15, minutes: 42 };
        this.cpuUsage = 23;
        this.memoryUsage = 67;
        this.systemTemp = 42;
        
        // Voltage parameters
        this.voltageMin = 227.2;
        this.voltageMax = 232.1;
        this.voltageAvg = 229.7;
        this.voltageStability = 98.5;
        
        // Current parameters
        this.currentPeak = 18.7;
        this.currentLow = 12.1;
        this.currentAvg = 15.0;
        this.frequency = 50;
        
        // Power parameters
        this.powerHistory = [2.1, 2.6, 3.0, 2.8, 3.4, 3.5];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupHardwareInteraction();
        this.setupNavigation();
        this.startRealtimeUpdates();
        this.initializeCharts();
    }

    setupEventListeners() {
        // Dashboard controls
        window.startSimulation = () => this.startSimulation();
        window.stopSimulation = () => this.stopSimulation();
        window.triggerAlert = () => this.triggerTestAlert();
        
        // Smooth scrolling
        window.scrollToSection = (sectionId) => this.scrollToSection(sectionId);
        
        // Hardware component interaction
        document.querySelectorAll('.component').forEach(component => {
            component.addEventListener('click', (e) => {
                this.showHardwareSpec(e.target.closest('.component').dataset.component);
            });
        });
    }

    setupNavigation() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    // Multi-fence system methods
    switchFence(fenceId) {
        if (fenceId === 'overview') {
            this.showOverviewDashboard();
            return;
        }

        this.currentFence = fenceId;
        const fenceData = this.fenceData[fenceId];
        
        if (!fenceData) return;

        // Update fence selector status
        document.getElementById('selectedFenceStatus').className = `status-badge ${fenceData.status}`;
        document.getElementById('selectedFenceStatus').textContent = fenceData.status.charAt(0).toUpperCase() + fenceData.status.slice(1);
        document.getElementById('selectedFenceLocation').textContent = fenceData.location;

        // Update main dashboard metrics
        this.updateDashboardMetrics(fenceData);
        
        // Add transition effect
        const mainDashboard = document.querySelector('.main-dashboard');
        mainDashboard.style.opacity = '0.5';
        
        setTimeout(() => {
            this.loadFenceSpecificData(fenceId);
            mainDashboard.style.opacity = '1';
        }, 300);
    }

    updateDashboardMetrics(fenceData) {
        // Update fence info
        document.getElementById('currentFenceName').textContent = fenceData.name;
        document.getElementById('currentFenceLocation').textContent = fenceData.location;
        
        // Update system status
        const systemStatus = document.getElementById('systemStatus');
        systemStatus.className = `status-indicator ${fenceData.status}`;
        systemStatus.querySelector('span').textContent = fenceData.status.charAt(0).toUpperCase() + fenceData.status.slice(1);
        
        // Update device count
        document.getElementById('deviceCount').textContent = fenceData.deviceCount;
        
        // Update metrics
        document.getElementById('currentValue').textContent = fenceData.current;
        document.getElementById('voltageValue').textContent = fenceData.voltage;
        document.getElementById('powerValue').textContent = fenceData.power;
        document.getElementById('systemUptime').textContent = fenceData.uptime;
        
        // Update system parameters
        const cpuElement = document.querySelector('.param-item .param-value');
        if (cpuElement) cpuElement.textContent = fenceData.cpuUsage + '%';
        
        const memoryElement = document.querySelectorAll('.param-item .param-value')[1];
        if (memoryElement) memoryElement.textContent = fenceData.memoryUsage + '%';
        
        const tempElement = document.querySelectorAll('.param-item .param-value')[2];
        if (tempElement) tempElement.textContent = fenceData.temperature + '°C';
    }

    loadFenceSpecificData(fenceId) {
        // Simulate loading fence-specific data
        const fenceData = this.fenceData[fenceId];
        
        // Update current values for simulation
        this.currentValue = fenceData.current;
        this.voltageValue = fenceData.voltage;
        this.powerValue = fenceData.power;
        this.deviceCount = fenceData.deviceCount;
        
        // Update charts and visualizations if they exist
        this.updateCharts();
    }

    showOverviewDashboard() {
        // Show aggregated view of all fences
        const overviewData = this.calculateOverviewMetrics();
        
        document.getElementById('currentFenceName').textContent = 'Overview - All Fences';
        document.getElementById('currentFenceLocation').textContent = 'Kerala State Electricity Board - All Zones';
        
        // Update with aggregated data
        document.getElementById('deviceCount').textContent = overviewData.totalDevices;
        document.getElementById('currentValue').textContent = overviewData.avgCurrent;
        document.getElementById('voltageValue').textContent = overviewData.avgVoltage;
        document.getElementById('powerValue').textContent = overviewData.totalPower;
    }

    calculateOverviewMetrics() {
        const fences = Object.values(this.fenceData);
        
        return {
            totalDevices: fences.reduce((sum, fence) => sum + fence.deviceCount, 0),
            avgCurrent: (fences.reduce((sum, fence) => sum + fence.current, 0) / fences.length).toFixed(1),
            avgVoltage: (fences.reduce((sum, fence) => sum + fence.voltage, 0) / fences.length).toFixed(1),
            totalPower: fences.reduce((sum, fence) => sum + fence.power, 0).toFixed(1),
            onlineFences: fences.filter(fence => fence.status === 'online').length,
            totalFences: fences.length
        };
    }

    toggleGlobalAlerts() {
        const panel = document.getElementById('globalAlertsPanel');
        this.globalAlertsPanelOpen = !this.globalAlertsPanelOpen;
        
        if (this.globalAlertsPanelOpen) {
            panel.classList.add('open');
        } else {
            panel.classList.remove('open');
        }
    }

    updateGlobalAlertCounts() {
        let totalCritical = 0, totalWarning = 0, totalInfo = 0;
        
        Object.values(this.fenceData).forEach(fence => {
            totalCritical += fence.alerts.critical;
            totalWarning += fence.alerts.warning;
            totalInfo += fence.alerts.info;
        });
        
        document.getElementById('globalCriticalCount').textContent = totalCritical;
        document.getElementById('globalWarningCount').textContent = totalWarning;
        document.getElementById('globalInfoCount').textContent = totalInfo;
    }

    refreshDashboard() {
        // Refresh current fence data
        this.switchFence(this.currentFence);
        this.updateGlobalAlertCounts();
        
        // Show refresh animation
        const refreshBtn = document.querySelector('button[onclick="refreshDashboard()"] i');
        refreshBtn.style.animation = 'spin 1s linear';
        setTimeout(() => {
            refreshBtn.style.animation = '';
        }, 1000);
    }

    setupHardwareInteraction() {
        // Add click handlers for hardware components
        const components = document.querySelectorAll('.component');
        components.forEach(component => {
            component.addEventListener('mouseenter', () => {
                component.style.transform = component.style.transform.includes('translateX') 
                    ? component.style.transform + ' scale(1.1)' 
                    : 'scale(1.1)';
            });
            
            component.addEventListener('mouseleave', () => {
                component.style.transform = component.style.transform.replace(' scale(1.1)', '');
            });
        });

        // Interactive component selection for new architecture diagram
        const peripheralComponents = document.querySelectorAll('.peripheral-components .component');
        const specCards = document.querySelectorAll('.spec-card');
        
        // Set default active component (microcontroller)
        const defaultCard = document.getElementById('microcontroller');
        if (defaultCard) {
            defaultCard.classList.add('active');
        }
        
        peripheralComponents.forEach(component => {
            component.addEventListener('click', function() {
                const componentType = this.getAttribute('data-component');
                
                // Remove active class from all components and cards
                peripheralComponents.forEach(c => c.classList.remove('active'));
                specCards.forEach(card => card.classList.remove('active'));
                
                // Add active class to clicked component
                this.classList.add('active');
                
                // Show corresponding spec card
                const targetCard = document.getElementById(componentType);
                if (targetCard) {
                    targetCard.classList.add('active');
                }
            });
        });
    }

    showHardwareSpec(componentType) {
        // Hide all spec cards
        document.querySelectorAll('.spec-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Show selected spec card
        const targetCard = document.getElementById(componentType);
        if (targetCard) {
            targetCard.classList.add('active');
        }
        
        // Add visual feedback to clicked component
        document.querySelectorAll('.component').forEach(comp => {
            comp.style.borderColor = 'transparent';
        });
        
        const clickedComponent = document.querySelector(`[data-component="${componentType}"]`);
        if (clickedComponent) {
            clickedComponent.style.borderColor = '#1e40af';
            clickedComponent.style.borderWidth = '3px';
        }
    }

    startSimulation() {
        if (this.isSimulationRunning) return;
        
        this.isSimulationRunning = true;
        this.updateSystemStatus('Simulation Running', 'online');
        
        // Start wave animations
        this.startWaveAnimations();
        
        this.simulationInterval = setInterval(() => {
            this.updateAllMetrics();
            this.updateSystemParameters();
            this.generateRandomEvents();
        }, 2000);
        
        this.addAlert('Simulation started successfully', 'normal');
    }

    stopSimulation() {
        if (!this.isSimulationRunning) return;
        
        this.isSimulationRunning = false;
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        
        // Stop wave animations
        this.stopWaveAnimations();
        
        this.updateSystemStatus('System Online', 'online');
        this.addAlert('Simulation stopped', 'normal');
    }

    startWaveAnimations() {
        // Enable wave animations
        const wavePaths = document.querySelectorAll('.wave-path, .wave-path-glow');
        wavePaths.forEach(path => {
            path.style.animationPlayState = 'running';
        });
        
        const waveLines = document.querySelectorAll('.wave-line');
        waveLines.forEach(line => {
            line.style.animationPlayState = 'running';
        });
    }

    stopWaveAnimations() {
        // Pause wave animations
        const wavePaths = document.querySelectorAll('.wave-path, .wave-path-glow');
        wavePaths.forEach(path => {
            path.style.animationPlayState = 'paused';
        });
        
        const waveLines = document.querySelectorAll('.wave-line');
        waveLines.forEach(line => {
            line.style.animationPlayState = 'paused';
        });
    }

    updateAllMetrics() {
        this.updateCurrentMetrics();
        this.updateVoltageMetrics();
        this.updatePowerMetrics();
    }

    updateCurrentMetrics() {
        // Store previous value
        this.previousCurrent = this.currentValue;
        
        // Update current value with realistic fluctuation
        const currentVariation = (Math.random() - 0.5) * 2;
        this.currentValue = Math.max(5, Math.min(25, this.currentValue + currentVariation));
        
        // Update display
        document.getElementById('currentValue').textContent = this.currentValue.toFixed(1);
        
        // Update previous value display
        const prevCurrentEl = document.getElementById('previousCurrent');
        if (prevCurrentEl) {
            prevCurrentEl.textContent = `${this.previousCurrent.toFixed(1)} A`;
        }
        
        // Update change details
        const currentChange = this.currentValue - this.previousCurrent;
        const currentChangePercent = ((currentChange / this.previousCurrent) * 100);
        const currentChangeEl = document.querySelector('.current-change-detail span');
        const currentTrendEl = document.querySelector('.current-change-detail i');
        
        if (currentChangeEl && currentTrendEl) {
            if (currentChange >= 0) {
                currentTrendEl.className = 'fas fa-arrow-up trend-up';
                currentChangeEl.textContent = `+${currentChange.toFixed(1)} A (+${currentChangePercent.toFixed(1)}%)`;
            } else {
                currentTrendEl.className = 'fas fa-arrow-down trend-down';
                currentChangeEl.textContent = `${currentChange.toFixed(1)} A (${currentChangePercent.toFixed(1)}%)`;
            }
        }
        
        // Update peak and low values occasionally
        if (Math.random() < 0.3) {
            if (this.currentValue > this.currentPeak) this.currentPeak = this.currentValue;
            if (this.currentValue < this.currentLow) this.currentLow = this.currentValue;
            
            const peakEl = document.querySelector('.current-parameters .param-item:nth-child(1) .param-value');
            const lowEl = document.querySelector('.current-parameters .param-item:nth-child(2) .param-value');
            
            if (peakEl) peakEl.textContent = `${this.currentPeak.toFixed(1)} A`;
            if (lowEl) lowEl.textContent = `${this.currentLow.toFixed(1)} A`;
        }
        
        // Update average
        this.currentAvg = (this.currentAvg * 0.9) + (this.currentValue * 0.1);
        const avgEl = document.querySelector('.current-parameters .param-item:nth-child(3) .param-value');
        if (avgEl) avgEl.textContent = `${this.currentAvg.toFixed(1)} A`;
        
        // Occasionally update frequency
        if (Math.random() < 0.1) {
            this.frequency = 50 + (Math.random() - 0.5) * 0.5;
            const freqEl = document.querySelector('.current-parameters .param-item:nth-child(4) .param-value');
            if (freqEl) freqEl.textContent = `${this.frequency.toFixed(1)} Hz`;
        }
    }

    updateVoltageMetrics() {
        // Store previous value
        this.previousVoltage = this.voltageValue;
        
        // Update voltage value
        const voltageVariation = (Math.random() - 0.5) * 5;
        this.voltageValue = Math.max(200, Math.min(250, this.voltageValue + voltageVariation));
        
        // Update display
        document.getElementById('voltageValue').textContent = this.voltageValue.toFixed(1);
        
        // Update previous value display
        const prevVoltageEl = document.getElementById('previousVoltage');
        if (prevVoltageEl) {
            prevVoltageEl.textContent = `${this.previousVoltage.toFixed(1)} V`;
        }
        
        // Update change details
        const voltageChange = this.voltageValue - this.previousVoltage;
        const voltageChangePercent = ((voltageChange / this.previousVoltage) * 100);
        const voltageChangeEl = document.querySelector('.voltage-change-detail span');
        const voltageTrendEl = document.querySelector('.voltage-change-detail i');
        
        if (voltageChangeEl && voltageTrendEl) {
            if (voltageChange >= 0) {
                voltageTrendEl.className = 'fas fa-arrow-up trend-up';
                voltageChangeEl.textContent = `+${voltageChange.toFixed(1)} V (+${voltageChangePercent.toFixed(1)}%)`;
            } else {
                voltageTrendEl.className = 'fas fa-arrow-down trend-down';
                voltageChangeEl.textContent = `${voltageChange.toFixed(1)} V (${voltageChangePercent.toFixed(1)}%)`;
            }
        }
        
        // Update min/max values occasionally
        if (Math.random() < 0.2) {
            if (this.voltageValue > this.voltageMax) this.voltageMax = this.voltageValue;
            if (this.voltageValue < this.voltageMin) this.voltageMin = this.voltageValue;
            
            const minEl = document.querySelector('.voltage-parameters .param-item:nth-child(1) .param-value');
            const maxEl = document.querySelector('.voltage-parameters .param-item:nth-child(2) .param-value');
            
            if (minEl) minEl.textContent = `${this.voltageMin.toFixed(1)} V`;
            if (maxEl) maxEl.textContent = `${this.voltageMax.toFixed(1)} V`;
        }
        
        // Update average and stability
        this.voltageAvg = (this.voltageAvg * 0.95) + (this.voltageValue * 0.05);
        this.voltageStability = Math.max(95, Math.min(100, this.voltageStability + (Math.random() - 0.5) * 0.5));
        
        const avgEl = document.querySelector('.voltage-parameters .param-item:nth-child(3) .param-value');
        const stabilityEl = document.querySelector('.voltage-parameters .param-item:nth-child(4) .param-value');
        
        if (avgEl) avgEl.textContent = `${this.voltageAvg.toFixed(1)} V`;
        if (stabilityEl) stabilityEl.textContent = `${this.voltageStability.toFixed(1)}%`;
        
        // Update voltage gauge
        const gaugePointer = document.querySelector('.gauge-pointer');
        const gaugeFill = document.querySelector('.gauge-fill');
        if (gaugePointer && gaugeFill) {
            const percentage = ((this.voltageValue - 200) / 40) * 100;
            gaugePointer.style.left = `${Math.max(0, Math.min(100, percentage))}%`;
            gaugeFill.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        }
        
        // Update status indicator
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            if (this.voltageValue >= 220 && this.voltageValue <= 240) {
                statusIndicator.textContent = 'OPTIMAL';
                statusIndicator.className = 'status-indicator status-optimal';
            } else if (this.voltageValue >= 210 && this.voltageValue <= 250) {
                statusIndicator.textContent = 'WARNING';
                statusIndicator.className = 'status-indicator status-warning';
            } else {
                statusIndicator.textContent = 'CRITICAL';
                statusIndicator.className = 'status-indicator status-critical';
            }
        }
        
        // Update voltage bar
        const voltagePercentage = ((this.voltageValue - 200) / 50) * 100;
        const voltageFill = document.getElementById('voltageFill');
        if (voltageFill) {
            voltageFill.style.width = `${Math.max(0, Math.min(100, voltagePercentage))}%`;
        }
    }

    updatePowerMetrics() {
        // Store previous value
        this.previousPower = this.powerValue;
        
        // Update power value
        const powerVariation = (Math.random() - 0.5) * 0.5;
        this.powerValue = Math.max(0, this.powerValue + powerVariation);
        
        // Update display
        document.getElementById('powerValue').textContent = this.powerValue.toFixed(1);
        
        // Update previous value display
        const prevPowerEl = document.getElementById('previousPower');
        if (prevPowerEl) {
            prevPowerEl.textContent = `${this.previousPower.toFixed(1)} kW`;
        }
        
        // Update change details
        const powerChange = this.powerValue - this.previousPower;
        const powerChangePercent = ((powerChange / this.previousPower) * 100);
        const powerChangeEl = document.querySelector('.power-change-detail span');
        const powerTrendEl = document.querySelector('.power-change-detail i');
        
        if (powerChangeEl && powerTrendEl) {
            if (powerChange >= 0) {
                powerTrendEl.className = 'fas fa-arrow-up trend-up';
                powerChangeEl.textContent = `+${powerChange.toFixed(1)} kW (+${powerChangePercent.toFixed(1)}%)`;
            } else {
                powerTrendEl.className = 'fas fa-arrow-down trend-down';
                powerChangeEl.textContent = `${powerChange.toFixed(1)} kW (${powerChangePercent.toFixed(1)}%)`;
            }
        }
        
        // Update power history for graph
        this.powerHistory.shift();
        this.powerHistory.push(this.powerValue);
        
        // Update graph bars
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (this.powerHistory[index] !== undefined) {
                const height = (this.powerHistory[index] / Math.max(...this.powerHistory)) * 100;
                bar.style.height = `${height}%`;
                bar.setAttribute('data-value', this.powerHistory[index].toFixed(1));
                
                // Highlight the current (last) bar
                if (index === bars.length - 1) {
                    bar.classList.add('active');
                } else {
                    bar.classList.remove('active');
                }
            }
        });
        
        // Update chart
        this.updateChart();
    }

    updateSystemParameters() {
        // Update system uptime
        this.systemUptime.minutes += Math.floor(Math.random() * 3);
        if (this.systemUptime.minutes >= 60) {
            this.systemUptime.hours++;
            this.systemUptime.minutes = 0;
        }
        
        const uptimeEl = document.getElementById('systemUptime');
        if (uptimeEl) {
            uptimeEl.textContent = `${this.systemUptime.hours}h ${this.systemUptime.minutes}m`;
        }
        
        // Update CPU usage
        this.cpuUsage += (Math.random() - 0.5) * 10;
        this.cpuUsage = Math.max(5, Math.min(95, this.cpuUsage));
        
        const cpuEl = document.querySelector('.system-parameters .param-item:nth-child(1) .param-value');
        if (cpuEl) cpuEl.textContent = `${this.cpuUsage.toFixed(0)}%`;
        
        // Update memory usage
        this.memoryUsage += (Math.random() - 0.5) * 5;
        this.memoryUsage = Math.max(20, Math.min(90, this.memoryUsage));
        
        const memoryEl = document.querySelector('.system-parameters .param-item:nth-child(2) .param-value');
        if (memoryEl) memoryEl.textContent = `${this.memoryUsage.toFixed(0)}%`;
        
        // Update temperature
        this.systemTemp += (Math.random() - 0.5) * 3;
        this.systemTemp = Math.max(25, Math.min(70, this.systemTemp));
        
        const tempEl = document.querySelector('.system-parameters .param-item:nth-child(3) .param-value');
        if (tempEl) tempEl.textContent = `${this.systemTemp.toFixed(0)}°C`;
        
        // Update health status based on parameters
        let healthStatus = 'Excellent';
        let healthClass = 'health-excellent';
        
        if (this.cpuUsage > 80 || this.memoryUsage > 85 || this.systemTemp > 60) {
            healthStatus = 'Warning';
            healthClass = 'health-warning';
        }
        if (this.cpuUsage > 90 || this.memoryUsage > 95 || this.systemTemp > 65) {
            healthStatus = 'Critical';
            healthClass = 'health-critical';
        }
        
        const healthEl = document.querySelector('.system-parameters .param-item:nth-child(4) .param-value');
        if (healthEl) {
            healthEl.textContent = healthStatus;
            healthEl.className = `param-value ${healthClass}`;
        }
        
        // Update matrix cells based on system health
        const matrixCells = document.querySelectorAll('.matrix-cell');
        matrixCells.forEach((cell, index) => {
            const randomFactor = Math.random();
            if (healthStatus === 'Critical' && randomFactor < 0.3) {
                cell.className = 'matrix-cell warning';
            } else if (healthStatus === 'Warning' && randomFactor < 0.1) {
                cell.className = 'matrix-cell warning';
            } else {
                cell.className = 'matrix-cell active';
            }
        });
    }

    generateRandomEvents() {
        const eventChance = Math.random();
        
        if (eventChance < 0.1) {
            // Critical alert (10% chance)
            this.addAlert('Illegal electrification detected on Power Line PL-403', 'critical');
            this.updateMapPoint('critical');
        } else if (eventChance < 0.25) {
            // Warning alert (15% chance)
            this.addAlert('Grid anomaly detected - unauthorized tap suspected', 'warning');
            this.updateMapPoint('warning');
        } else if (eventChance < 0.4) {
            // Normal events (15% chance)
            const normalEvents = [
                'Power line monitoring system online',
                'Smart circuit breakers calibrated',
                'Grid status verification completed',
                'Infrastructure monitoring active'
            ];
            const randomEvent = normalEvents[Math.floor(Math.random() * normalEvents.length)];
            this.addAlert(randomEvent, 'normal');
        }
    }

    triggerTestAlert() {
        this.addAlert('TEST ALERT: Illegal electrification detected on Power Line PL-403 - Auto disconnect activated', 'critical');
        this.updateMapPoint('critical');
        
        // Flash the system status
        const statusElement = document.getElementById('systemStatus');
        const originalClass = statusElement.className;
        statusElement.className = 'status-indicator offline';
        statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Grid Protection Active</span>';
        
        setTimeout(() => {
            statusElement.className = originalClass;
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Online</span>';
        }, 3000);
    }

    addAlert(message, type) {
        const alertList = document.getElementById('alertList');
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${type}`;
        
        let icon;
        switch (type) {
            case 'critical':
                icon = 'fas fa-exclamation-triangle';
                break;
            case 'warning':
                icon = 'fas fa-exclamation-circle';
                break;
            default:
                icon = 'fas fa-info-circle';
        }
        
        alertItem.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <small>Just now</small>
        `;
        
        // Add to top of list
        alertList.insertBefore(alertItem, alertList.firstChild);
        
        // Remove oldest alerts if more than 5
        const alerts = alertList.querySelectorAll('.alert-item');
        if (alerts.length > 5) {
            alertList.removeChild(alerts[alerts.length - 1]);
        }
        
        // Update alert timestamps
        this.updateAlertTimestamps();
    }

    updateAlertTimestamps() {
        const alerts = document.querySelectorAll('.alert-item small');
        alerts.forEach((timestamp, index) => {
            if (index === 0) {
                timestamp.textContent = 'Just now';
            } else {
                timestamp.textContent = `${index + 1} minute${index > 0 ? 's' : ''} ago`;
            }
        });
    }

    updateMapPoint(status) {
        const mapPoints = document.querySelectorAll('.map-point');
        const randomPoint = mapPoints[Math.floor(Math.random() * mapPoints.length)];
        
        // Remove existing status classes
        randomPoint.classList.remove('active', 'warning', 'critical');
        randomPoint.classList.add(status);
        
        // Reset to active after 5 seconds for non-critical alerts
        if (status !== 'critical') {
            setTimeout(() => {
                randomPoint.classList.remove(status);
                randomPoint.classList.add('active');
            }, 5000);
        }
    }

    updateSystemStatus(status, type) {
        const statusElement = document.getElementById('systemStatus');
        statusElement.className = `status-indicator ${type}`;
        statusElement.innerHTML = `<i class="fas fa-circle"></i><span>${status}</span>`;
    }

    startRealtimeUpdates() {
        // Update timestamps every minute
        setInterval(() => {
            this.updateAlertTimestamps();
        }, 60000);
        
        // Subtle metric fluctuations even when simulation is off
        setInterval(() => {
            if (!this.isSimulationRunning) {
                const currentEl = document.getElementById('currentValue');
                const current = parseFloat(currentEl.textContent);
                const newCurrent = current + (Math.random() - 0.5) * 0.1;
                currentEl.textContent = Math.max(0, newCurrent).toFixed(1);
            }
        }, 5000);
    }

    initializeCharts() {
        const canvas = document.getElementById('currentChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.chartData = [];
        
        // Initialize with some sample data
        for (let i = 0; i < 20; i++) {
            this.chartData.push(15 + Math.random() * 3);
        }
        
        this.drawChart(ctx, canvas);
    }

    updateChart() {
        const canvas = document.getElementById('currentChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Add new data point
        this.chartData.push(this.currentValue);
        
        // Keep only last 20 points
        if (this.chartData.length > 20) {
            this.chartData.shift();
        }
        
        this.drawChart(ctx, canvas);
    }

    drawChart(ctx, canvas) {
        const width = canvas.width;
        const height = canvas.height;
        const padding = 10;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set styles
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw chart line
        if (this.chartData.length > 1) {
            ctx.strokeStyle = '#1e40af';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const maxVal = Math.max(...this.chartData);
            const minVal = Math.min(...this.chartData);
            const range = maxVal - minVal || 1;
            
            this.chartData.forEach((value, index) => {
                const x = padding + (index / (this.chartData.length - 1)) * (width - 2 * padding);
                const y = height - padding - ((value - minVal) / range) * (height - 2 * padding);
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Draw points
            ctx.fillStyle = '#1e40af';
            this.chartData.forEach((value, index) => {
                const x = padding + (index / (this.chartData.length - 1)) * (width - 2 * padding);
                const y = height - padding - ((value - minVal) / range) * (height - 2 * padding);
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Utility functions for animations and interactions
function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = start + (range * progress);
        
        element.textContent = value.toFixed(1);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ IntelliFence System Initializing...');
    
    // Initialize the main system
    const intelliFence = new IntelliFenceSystem();
    
    // Make it globally accessible for other components
    window.intelliFenceSystem = intelliFence;
    
    // Global functions for HTML event handlers
    window.switchFence = function(fenceId) {
        intelliFence.switchFence(fenceId);
        
        // Update real-time streaming for new fence
        if (window.realTimeStreamer) {
            window.realTimeStreamer.switchFenceData(fenceId);
        }
    };
    
    window.toggleGlobalAlerts = function() {
        intelliFence.toggleGlobalAlerts();
    };
    
    window.refreshDashboard = function() {
        intelliFence.refreshDashboard();
    };
    
    window.switchToFence = function(fenceId) {
        // Switch to fence and update dropdown
        document.getElementById('fenceSelector').value = fenceId;
        intelliFence.switchFence(fenceId);
        
        // Close alerts panel if open
        if (intelliFence.globalAlertsPanelOpen) {
            intelliFence.toggleGlobalAlerts();
        }
        
        // Scroll to dashboard
        document.getElementById('dashboard').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    
    // Initialize global alert counts
    intelliFence.updateGlobalAlertCounts();
    
    // Remove automatic popup - now only shows on button click
    
    // Add click handler to popup content to prevent closing
    const popupContent = document.querySelector('.popup-content');
    if (popupContent) {
        popupContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Add some initial animations
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(30px)';
            heroTitle.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 500);
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .metric-card, .spec-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize advanced features
    window.dataStreamer = new RealTimeDataStreamer(intelliFence);
    window.geoMapController = new GeographicalMapController(intelliFence);
    window.aiPredictiveAnalytics = new AIPredictiveAnalytics(intelliFence);
    window.alertAutomation = new SmartAlertAutomation();
    
    console.log('✅ IntelliFence System Online');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case '2':
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case '3':
                e.preventDefault();
                document.getElementById('hardware')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case '4':
                e.preventDefault();
                document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
                break;
        }
    }
});

// Service Worker for PWA capabilities (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker when available
        console.log('📱 PWA capabilities detected');
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('IntelliFence Error:', e.error);
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ IntelliFence loaded in ${loadTime.toFixed(2)}ms`);
});

// Problem Statement Popup Functions
function showProblemStatementPopup() {
    // Always show popup when button is clicked (remove cookie check)
    const popup = document.getElementById('problem-statement-popup');
    if (popup && popup.style.display !== 'flex') {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        popup.style.transition = 'none';
        
        // Force reflow
        popup.offsetHeight;
        
        setTimeout(() => {
            popup.style.transition = 'all 0.3s ease';
            popup.style.opacity = '1';
            popup.style.transform = 'scale(1)';
        }, 50);
    }
}

function closeProblemStatementPopup() {
    const popup = document.getElementById('problem-statement-popup');
    if (popup) {
        // Add exit animation
        popup.style.transition = 'all 0.3s ease';
        popup.style.opacity = '0';
        popup.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
        
        // Remove cookie setting since popup is now manual
    }
}

function learnMoreProblemStatement() {
    // Close popup first
    closeProblemStatementPopup();
    
    // Redirect to SIH 2025 Problem Statement page in new tab
    window.open('https://www.sih.gov.in/sih2025PS', '_blank');
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    const popup = document.getElementById('problem-statement-popup');
    const popupContent = document.querySelector('.popup-content');
    const psButton = document.querySelector('.ps-button');
    
    // Only close if popup is visible, click is outside popup content, and not on PS button
    if (popup && 
        popup.style.display === 'flex' && 
        !popupContent.contains(e.target) && 
        !psButton.contains(e.target) &&
        e.target !== psButton) {
        closeProblemStatementPopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const popup = document.getElementById('problem-statement-popup');
        if (popup && popup.style.display === 'flex') {
            closeProblemStatementPopup();
        }
    }
});

// Map control functions for Live Device Locations
function refreshMap() {
    console.log('Refreshing map data...');
    
    // Add visual feedback
    const refreshBtn = document.querySelector('.map-btn');
    const icon = refreshBtn.querySelector('i');
    
    // Add spinning animation
    icon.style.animation = 'spin 1s linear';
    
    // Simulate data refresh
    setTimeout(() => {
        icon.style.animation = '';
        
        // Update some device statuses randomly
        const devices = document.querySelectorAll('.device-marker');
        devices.forEach(device => {
            const tooltip = device.querySelector('.marker-tooltip');
            if (tooltip && Math.random() > 0.7) {
                // Randomly update voltage/current values
                const voltage = (220 + (Math.random() - 0.5) * 20).toFixed(1);
                const current = (8 + (Math.random() - 0.5) * 10).toFixed(1);
                
                const content = tooltip.innerHTML;
                const updatedContent = content.replace(/Voltage: [\d.]+V/, `Voltage: ${voltage}V`)
                                             .replace(/Current: [\d.]+A/, `Current: ${current}A`);
                tooltip.innerHTML = updatedContent;
            }
        });
        
        console.log('Map data refreshed!');
    }, 1000);
}

function toggleSatellite() {
    const mapBackground = document.querySelector('.map-background');
    const toggleBtn = document.querySelectorAll('.map-btn')[1];
    const icon = toggleBtn.querySelector('i');
    
    if (mapBackground.classList.contains('satellite-view')) {
        // Switch back to map view
        mapBackground.classList.remove('satellite-view');
        icon.className = 'fas fa-satellite';
        console.log('Switched to map view');
    } else {
        // Switch to satellite view
        mapBackground.classList.add('satellite-view');
        icon.className = 'fas fa-map';
        console.log('Switched to satellite view');
    }
}

// Add CSS for satellite view and animations
const satelliteStyles = `
.map-background.satellite-view {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 25%, #2d3748 50%, #4a5568 75%, #2d3748 100%);
    background-size: 40px 40px;
}

.map-background.satellite-view .road {
    background: linear-gradient(135deg, #718096, #a0aec0);
}

.map-background.satellite-view .area-label {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-color: #4a5568;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
`;

// Add the satellite styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = satelliteStyles;
document.head.appendChild(styleSheet);

// Real-Time Data Streaming Class
class RealTimeDataStreamer {
    constructor(fenceSystem) {
        this.fenceSystem = fenceSystem;
        this.isStreaming = true;
        this.updateInterval = 2000; // 2 seconds default
        this.maxDataPoints = 50;
        this.streamInterval = null;
        
        // Data storage for charts
        this.chartData = {
            voltage: [],
            current: [],
            power: [],
            health: [],
            timestamps: []
        };
        
        // Chart instances (will be created with Chart.js)
        this.charts = {};
        
        this.initializeStreaming();
        this.setupEventListeners();
    }
    
    initializeStreaming() {
        // Simulate WebSocket connection status
        this.updateConnectionStatus(true);
        
        // Initialize charts with placeholder canvases
        this.initializeChartPlaceholders();
        
        // Start data streaming
        this.startStreaming();
        
        console.log('Real-time data streaming initialized');
    }
    
    initializeChartPlaceholders() {
        const chartContainers = ['voltageChart', 'currentChart', 'powerChart', 'healthChart'];
        
        chartContainers.forEach(chartId => {
            const canvas = document.getElementById(chartId);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw placeholder grid
                this.drawPlaceholderChart(ctx, canvas.width, canvas.height, chartId);
                
                console.log(`Initialized placeholder for ${chartId}`);
            }
        });
    }
    
    drawPlaceholderChart(ctx, width, height, chartId) {
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Set chart styling
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.font = '12px Arial';
        ctx.fillStyle = '#6b7280';
        
        // Draw grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        for (let i = 0; i <= 10; i++) {
            const x = padding + (chartWidth / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        // Draw sample data line
        ctx.strokeStyle = this.getChartColor(chartId);
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i <= 10; i++) {
            const x = padding + (chartWidth / 10) * i;
            const randomVariation = Math.sin(i * 0.5) * 20 + Math.random() * 10;
            const y = padding + chartHeight/2 + randomVariation;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Add chart title
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${chartId.replace('Chart', '').toUpperCase()} - Live Data`, width/2, 25);
    }
    
    getChartColor(chartId) {
        const colors = {
            voltageChart: '#3b82f6',
            currentChart: '#ef4444',
            powerChart: '#10b981',
            healthChart: '#f59e0b'
        };
        return colors[chartId] || '#6b7280';
    }
    
    startStreaming() {
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
        }
        
        this.streamInterval = setInterval(() => {
            if (this.isStreaming) {
                this.generateNewDataPoint();
                this.updateCharts();
                this.updateReadings();
                this.updateConnectionStatus(true);
            }
        }, this.updateInterval);
        
        console.log(`Started streaming with ${this.updateInterval}ms interval`);
    }
    
    generateNewDataPoint() {
        const currentFenceData = this.fenceSystem.fenceData[this.fenceSystem.currentFence];
        const timestamp = new Date();
        
        // Generate realistic variations
        const voltageBase = currentFenceData.voltage;
        const currentBase = currentFenceData.current;
        const powerBase = currentFenceData.power;
        
        const newData = {
            voltage: voltageBase + (Math.random() - 0.5) * 6,  // ±3V variation
            current: currentBase + (Math.random() - 0.5) * 4,  // ±2A variation
            power: powerBase + (Math.random() - 0.5) * 1,      // ±0.5kW variation
            health: 95 + Math.random() * 5,                     // 95-100% health
            timestamp: timestamp
        };
        
        // Add to data arrays
        Object.keys(newData).forEach(key => {
            if (key !== 'timestamp') {
                this.chartData[key].push(newData[key]);
                
                // Keep only last N data points
                if (this.chartData[key].length > this.maxDataPoints) {
                    this.chartData[key].shift();
                }
            }
        });
        
        this.chartData.timestamps.push(timestamp);
        if (this.chartData.timestamps.length > this.maxDataPoints) {
            this.chartData.timestamps.shift();
        }
        
        // Update fence data with latest values
        currentFenceData.voltage = newData.voltage;
        currentFenceData.current = newData.current;
        currentFenceData.power = newData.power;
    }
    
    updateCharts() {
        const chartConfigs = [
            { id: 'voltageChart', data: this.chartData.voltage, color: '#3b82f6' },
            { id: 'currentChart', data: this.chartData.current, color: '#ef4444' },
            { id: 'powerChart', data: this.chartData.power, color: '#10b981' },
            { id: 'healthChart', data: this.chartData.health, color: '#f59e0b' }
        ];
        
        chartConfigs.forEach(config => {
            const canvas = document.getElementById(config.id);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this.drawRealTimeChart(ctx, canvas.width, canvas.height, config.data, config.color);
            }
        });
    }
    
    drawRealTimeChart(ctx, width, height, data, color) {
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw data line
        if (data.length > 1) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const minVal = Math.min(...data);
            const maxVal = Math.max(...data);
            const range = maxVal - minVal || 1;
            
            data.forEach((value, index) => {
                const x = padding + (chartWidth / (data.length - 1)) * index;
                const normalizedValue = (value - minVal) / range;
                const y = padding + chartHeight - (normalizedValue * chartHeight);
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Add glow effect for latest point
            if (data.length > 0) {
                const lastIndex = data.length - 1;
                const x = padding + (chartWidth / (data.length - 1)) * lastIndex;
                const normalizedValue = (data[lastIndex] - minVal) / range;
                const y = padding + chartHeight - (normalizedValue * chartHeight);
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
                
                // Pulse effect
                ctx.beginPath();
                ctx.arc(x, y, 8, 0, 2 * Math.PI);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
    
    updateReadings() {
        const currentFenceData = this.fenceSystem.fenceData[this.fenceSystem.currentFence];
        
        // Update main readings
        this.updateElement('voltageReading', currentFenceData.voltage.toFixed(1));
        this.updateElement('currentReading', currentFenceData.current.toFixed(1));
        this.updateElement('powerReading', currentFenceData.power.toFixed(1));
        this.updateElement('healthReading', '97%');
        
        // Update statistics
        if (this.chartData.voltage.length > 0) {
            this.updateElement('voltageMin', Math.min(...this.chartData.voltage).toFixed(1));
            this.updateElement('voltageMax', Math.max(...this.chartData.voltage).toFixed(1));
            this.updateElement('voltageAvg', (this.chartData.voltage.reduce((a,b) => a+b) / this.chartData.voltage.length).toFixed(1));
            
            this.updateElement('currentMin', Math.min(...this.chartData.current).toFixed(1));
            this.updateElement('currentMax', Math.max(...this.chartData.current).toFixed(1));
            this.updateElement('currentAvg', (this.chartData.current.reduce((a,b) => a+b) / this.chartData.current.length).toFixed(1));
            
            this.updateElement('powerMin', Math.min(...this.chartData.power).toFixed(1));
            this.updateElement('powerMax', Math.max(...this.chartData.power).toFixed(1));
            this.updateElement('powerAvg', (this.chartData.power.reduce((a,b) => a+b) / this.chartData.power.length).toFixed(1));
        }
        
        // Update trend indicators
        this.updateTrendIndicators();
        
        // Update last update time
        this.updateElement('lastUpdate', 'Just now');
        
        // Update data rate
        this.updateElement('dataRate', `${(1000/this.updateInterval).toFixed(1)} packets/sec`);
    }
    
    updateTrendIndicators() {
        const trends = ['voltageTrend', 'currentTrend', 'powerTrend', 'healthTrend'];
        const dataKeys = ['voltage', 'current', 'power', 'health'];
        
        trends.forEach((trendId, index) => {
            const data = this.chartData[dataKeys[index]];
            if (data.length >= 2) {
                const current = data[data.length - 1];
                const previous = data[data.length - 2];
                const change = ((current - previous) / previous * 100);
                
                const element = document.getElementById(trendId);
                if (element) {
                    const icon = element.querySelector('i');
                    if (Math.abs(change) < 0.5) {
                        icon.className = 'fas fa-minus';
                        element.className = 'trend-indicator';
                    } else if (change > 0) {
                        icon.className = 'fas fa-arrow-up';
                        element.className = change > 5 ? 'trend-indicator warning' : 'trend-indicator';
                    } else {
                        icon.className = 'fas fa-arrow-down';
                        element.className = change < -5 ? 'trend-indicator critical' : 'trend-indicator';
                    }
                    
                    const textSpan = element.querySelector('span') || element.childNodes[1];
                    if (textSpan) {
                        textSpan.textContent = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
                    }
                }
            }
        });
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateConnectionStatus(isConnected) {
        const icon = document.getElementById('connectionIcon');
        const status = document.getElementById('connectionStatus');
        
        if (icon && status) {
            if (isConnected) {
                icon.className = 'fas fa-wifi connection-icon online';
                status.textContent = 'Connected to ESP32';
            } else {
                icon.className = 'fas fa-wifi-slash connection-icon offline';
                status.textContent = 'Connection Lost';
            }
        }
    }
    
    setupEventListeners() {
        // Pause/Resume streaming
        const pauseBtn = document.getElementById('pauseStream');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.isStreaming = !this.isStreaming;
                const icon = pauseBtn.querySelector('i');
                if (this.isStreaming) {
                    icon.className = 'fas fa-pause';
                    pauseBtn.title = 'Pause Data Stream';
                    pauseBtn.classList.remove('active');
                } else {
                    icon.className = 'fas fa-play';
                    pauseBtn.title = 'Resume Data Stream';
                    pauseBtn.classList.add('active');
                }
            });
        }
        
        // Reset charts
        const resetBtn = document.getElementById('resetCharts');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetChartData();
            });
        }
        
        // Update frequency
        const frequencySelect = document.getElementById('updateFrequency');
        if (frequencySelect) {
            frequencySelect.addEventListener('change', (e) => {
                this.updateInterval = parseInt(e.target.value);
                this.startStreaming(); // Restart with new interval
            });
        }
        
        // Data points
        const pointsSelect = document.getElementById('dataPoints');
        if (pointsSelect) {
            pointsSelect.addEventListener('change', (e) => {
                this.maxDataPoints = parseInt(e.target.value);
                this.trimDataArrays();
            });
        }
        
        // Export data
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportDataToCSV();
            });
        }
    }
    
    resetChartData() {
        Object.keys(this.chartData).forEach(key => {
            this.chartData[key] = [];
        });
        this.initializeChartPlaceholders();
        console.log('Chart data reset');
    }
    
    trimDataArrays() {
        Object.keys(this.chartData).forEach(key => {
            if (this.chartData[key].length > this.maxDataPoints) {
                this.chartData[key] = this.chartData[key].slice(-this.maxDataPoints);
            }
        });
    }
    
    exportDataToCSV() {
        const headers = ['Timestamp', 'Voltage (V)', 'Current (A)', 'Power (kW)', 'Health (%)'];
        const csvData = [headers.join(',')];
        
        for (let i = 0; i < this.chartData.timestamps.length; i++) {
            const row = [
                this.chartData.timestamps[i].toISOString(),
                this.chartData.voltage[i]?.toFixed(2) || '',
                this.chartData.current[i]?.toFixed(2) || '',
                this.chartData.power[i]?.toFixed(2) || '',
                this.chartData.health[i]?.toFixed(1) || ''
            ];
            csvData.push(row.join(','));
        }
        
        const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intellifence-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('Data exported to CSV');
    }
    
    // Method to switch fence data when fence changes
    switchFenceData(fenceId) {
        // Reset data for new fence
        this.resetChartData();
        console.log(`Switched to ${fenceId} - charts reset for new data stream`);
    }
}

// Initialize real-time streaming when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the main system to initialize
    setTimeout(() => {
        if (window.intelliFenceSystem) {
            window.realTimeStreamer = new RealTimeDataStreamer(window.intelliFenceSystem);
            window.geoMapController = new GeographicalMapController(window.intelliFenceSystem);
            window.aiPredictor = new AIPredictiveAnalytics(window.intelliFenceSystem);
            console.log('Real-time data streaming system started!');
            console.log('Geographical map controller initialized!');
            console.log('AI predictive analytics initialized!');
        }
    }, 1000);
});

// AI Predictive Analytics Class
class AIPredictiveAnalytics {
    constructor(fenceSystem) {
        this.fenceSystem = fenceSystem;
        this.predictionModel = {
            accuracy: 94.7,
            earlyDetection: 4.2,
            efficiencyGain: 24.8,
            preventedFailures: 17
        };
        
        this.trainingProgress = {
            dataCollection: 100,
            patternAnalysis: 87,
            modelTraining: 72,
            validation: 45
        };
        
        this.maintenanceQueue = [
            {
                id: 1,
                priority: 'urgent',
                title: 'Transformer Inspection - Kozhikode',
                description: 'AI detected temperature anomalies. Immediate inspection required.',
                eta: '2 hours',
                priority_level: 'Critical',
                fenceId: 'fence-c'
            },
            {
                id: 2,
                priority: 'high',
                title: 'Cable Tension Check - Trivandrum',
                description: 'Predictive model suggests preventive maintenance due to weather stress.',
                eta: '1 day',
                priority_level: 'High',
                fenceId: 'fence-a'
            },
            {
                id: 3,
                priority: 'medium',
                title: 'Routine Inspection - Kochi',
                description: 'Monthly scheduled maintenance for industrial sector power lines.',
                eta: '3 days',
                priority_level: 'Medium',
                fenceId: 'fence-b'
            }
        ];
        
        this.initializePredictiveAnalytics();
        this.setupAnalyticsControls();
        this.startAIProcessing();
        
        console.log('AI Predictive Analytics system initialized');
    }
    
    initializePredictiveAnalytics() {
        // Initialize pattern chart
        this.initializePatternChart();
        
        // Update performance metrics
        this.updatePerformanceMetrics();
        
        // Update learning progress
        this.updateLearningProgress();
        
        // Generate initial predictions
        this.generatePredictions();
    }
    
    initializePatternChart() {
        const canvas = document.getElementById('patternChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            this.drawPatternChart(ctx, canvas.width, canvas.height);
        }
    }
    
    drawPatternChart(ctx, width, height) {
        const padding = 30;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Generate pattern data
        const patternData = this.generatePatternData();
        
        // Draw power consumption pattern
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        patternData.forEach((value, index) => {
            const x = padding + (chartWidth / (patternData.length - 1)) * index;
            const y = padding + chartHeight - (value / 100 * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw voltage drop events
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        
        const dropEvents = [2, 9, 16, 23]; // Monday events
        dropEvents.forEach(index => {
            if (index < patternData.length) {
                const x = padding + (chartWidth / (patternData.length - 1)) * index;
                const y = padding + chartHeight - (patternData[index] / 100 * chartHeight);
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
                
                // Add warning indicator
                ctx.beginPath();
                ctx.moveTo(x, y - 10);
                ctx.lineTo(x, y - 20);
                ctx.stroke();
            }
        });
        
        // Add chart title
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Power Consumption Pattern Analysis', width/2, 20);
    }
    
    generatePatternData() {
        // Simulate 30-day power consumption pattern
        const data = [];
        for (let i = 0; i < 30; i++) {
            const dayOfWeek = i % 7;
            const isMonday = dayOfWeek === 0;
            const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
            
            let baseValue = 75;
            if (isMonday) {
                baseValue = 85; // Higher consumption on Mondays
            } else if (isWeekend) {
                baseValue = 60; // Lower consumption on weekends
            }
            
            // Add some random variation
            const variation = (Math.random() - 0.5) * 20;
            data.push(Math.max(30, Math.min(100, baseValue + variation)));
        }
        return data;
    }
    
    updatePerformanceMetrics() {
        // Simulate metric improvements over time
        setInterval(() => {
            // Small random improvements
            this.predictionModel.accuracy += (Math.random() - 0.5) * 0.1;
            this.predictionModel.earlyDetection += (Math.random() - 0.5) * 0.05;
            this.predictionModel.efficiencyGain += (Math.random() - 0.5) * 0.02;
            
            // Bound values
            this.predictionModel.accuracy = Math.max(90, Math.min(99, this.predictionModel.accuracy));
            this.predictionModel.earlyDetection = Math.max(3, Math.min(7, this.predictionModel.earlyDetection));
            this.predictionModel.efficiencyGain = Math.max(20, Math.min(30, this.predictionModel.efficiencyGain));
            
            // Update UI
            this.refreshPerformanceDisplay();
        }, 10000); // Update every 10 seconds
    }
    
    refreshPerformanceDisplay() {
        const metricCards = document.querySelectorAll('.metric-card');
        if (metricCards.length >= 4) {
            metricCards[0].querySelector('.value').textContent = `${this.predictionModel.accuracy.toFixed(1)}%`;
            metricCards[1].querySelector('.value').textContent = `${this.predictionModel.earlyDetection.toFixed(1)} days`;
            metricCards[2].querySelector('.value').textContent = `${this.predictionModel.efficiencyGain.toFixed(1)}%`;
            metricCards[3].querySelector('.value').textContent = this.predictionModel.preventedFailures;
            
            // Update chart bars
            metricCards[0].querySelector('.chart-bar').style.height = `${this.predictionModel.accuracy}%`;
            metricCards[1].querySelector('.chart-bar').style.height = `${(this.predictionModel.earlyDetection / 7) * 100}%`;
            metricCards[2].querySelector('.chart-bar').style.height = `${(this.predictionModel.efficiencyGain / 30) * 100}%`;
            metricCards[3].querySelector('.chart-bar').style.height = `${(this.predictionModel.preventedFailures / 20) * 100}%`;
        }
    }
    
    updateLearningProgress() {
        // Simulate training progress
        setInterval(() => {
            // Increment progress values
            if (this.trainingProgress.validation < 100) {
                this.trainingProgress.validation += Math.random() * 2;
            }
            if (this.trainingProgress.modelTraining < 100 && this.trainingProgress.validation > 50) {
                this.trainingProgress.modelTraining += Math.random() * 1.5;
            }
            if (this.trainingProgress.patternAnalysis < 100) {
                this.trainingProgress.patternAnalysis += Math.random() * 0.5;
            }
            
            // Bound values
            Object.keys(this.trainingProgress).forEach(key => {
                this.trainingProgress[key] = Math.min(100, this.trainingProgress[key]);
            });
            
            // Update UI
            this.refreshLearningDisplay();
        }, 8000); // Update every 8 seconds
    }
    
    refreshLearningDisplay() {
        const progressItems = document.querySelectorAll('.progress-item');
        const progressKeys = ['dataCollection', 'patternAnalysis', 'modelTraining', 'validation'];
        
        progressItems.forEach((item, index) => {
            if (progressKeys[index]) {
                const value = this.trainingProgress[progressKeys[index]];
                const progressFill = item.querySelector('.progress-fill');
                const progressValue = item.querySelector('.progress-value');
                
                if (progressFill) {
                    progressFill.style.width = `${value}%`;
                }
                if (progressValue) {
                    progressValue.textContent = `${Math.round(value)}%`;
                }
            }
        });
    }
    
    generatePredictions() {
        // Analyze current fence data and generate predictions
        setInterval(() => {
            this.analyzeFenceHealth();
            this.updateFailurePredictions();
            this.generateMaintenanceRecommendations();
        }, 15000); // Update every 15 seconds
    }
    
    analyzeFenceHealth() {
        Object.keys(this.fenceSystem.fenceData).forEach(fenceId => {
            const fence = this.fenceSystem.fenceData[fenceId];
            
            // Analyze voltage stability
            if (fence.voltage < 220 || fence.voltage > 250) {
                fence.healthScore = Math.max(0, (fence.healthScore || 95) - 5);
            } else if (fence.voltage >= 230 && fence.voltage <= 240) {
                fence.healthScore = Math.min(100, (fence.healthScore || 95) + 1);
            }
            
            // Analyze current fluctuations
            if (fence.current > 20) {
                fence.healthScore = Math.max(0, (fence.healthScore || 95) - 3);
            }
            
            // Update alerts based on health
            if (fence.healthScore < 80) {
                fence.alerts.critical = Math.max(1, fence.alerts.critical);
                fence.status = 'critical';
            } else if (fence.healthScore < 90) {
                fence.alerts.warning = Math.max(1, fence.alerts.warning);
                fence.status = 'warning';
            } else {
                fence.status = 'online';
            }
        });
    }
    
    updateFailurePredictions() {
        // Update failure prediction factors
        const factors = document.querySelectorAll('.factor-level');
        if (factors.length >= 3) {
            // Voltage instability factor
            const voltageInstability = 75 + Math.random() * 20;
            factors[0].style.width = `${voltageInstability}%`;
            
            // Temperature stress factor  
            const temperatureStress = 65 + Math.random() * 15;
            factors[1].style.width = `${temperatureStress}%`;
            
            // Load fluctuation factor
            const loadFluctuation = 60 + Math.random() * 20;
            factors[2].style.width = `${loadFluctuation}%`;
            
            // Update risk level
            const avgRisk = (voltageInstability + temperatureStress + loadFluctuation) / 3;
            const riskLevel = document.querySelector('.risk-level');
            if (riskLevel) {
                riskLevel.style.width = `${avgRisk}%`;
            }
        }
    }
    
    generateMaintenanceRecommendations() {
        // Randomly update maintenance priorities based on AI analysis
        this.maintenanceQueue.forEach(item => {
            const fence = this.fenceSystem.fenceData[item.fenceId];
            if (fence && fence.healthScore < 85) {
                // Escalate priority if health is deteriorating
                if (item.priority === 'medium') {
                    item.priority = 'high';
                } else if (item.priority === 'high') {
                    item.priority = 'urgent';
                }
            }
        });
        
        // Update maintenance display
        this.refreshMaintenanceDisplay();
    }
    
    refreshMaintenanceDisplay() {
        const maintenanceItems = document.querySelectorAll('.maintenance-item');
        this.maintenanceQueue.forEach((item, index) => {
            if (maintenanceItems[index]) {
                const element = maintenanceItems[index];
                element.className = `maintenance-item ${item.priority}`;
                
                // Update priority indicator
                const priority = element.querySelector('.maintenance-priority span');
                if (priority) {
                    priority.textContent = item.priority.charAt(0).toUpperCase() + item.priority.slice(1);
                }
            }
        });
    }
    
    setupAnalyticsControls() {
        // Pattern period selector
        const patternPeriod = document.getElementById('patternPeriod');
        if (patternPeriod) {
            patternPeriod.addEventListener('change', (e) => {
                this.updatePatternAnalysis(e.target.value);
            });
        }
        
        // Retrain model button
        const trainModel = document.getElementById('trainModel');
        if (trainModel) {
            trainModel.addEventListener('click', () => {
                this.retrainModel();
            });
        }
        
        // Export insights button
        const exportInsights = document.getElementById('exportInsights');
        if (exportInsights) {
            exportInsights.addEventListener('click', () => {
                this.exportInsights();
            });
        }
        
        // Maintenance action buttons
        document.querySelectorAll('.maintenance-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleMaintenanceAction(e.target);
            });
        });
    }
    
    updatePatternAnalysis(period) {
        console.log(`Updating pattern analysis for period: ${period}`);
        // Regenerate pattern chart for selected period
        this.initializePatternChart();
    }
    
    retrainModel() {
        console.log('Retraining AI model...');
        
        // Reset training progress
        this.trainingProgress = {
            dataCollection: 0,
            patternAnalysis: 0,
            modelTraining: 0,
            validation: 0
        };
        
        // Simulate training process
        const trainBtn = document.getElementById('trainModel');
        if (trainBtn) {
            trainBtn.disabled = true;
            trainBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Training...';
            
            setTimeout(() => {
                trainBtn.disabled = false;
                trainBtn.innerHTML = '<i class="fas fa-play"></i> Retrain Model';
                console.log('Model retraining completed!');
            }, 5000);
        }
    }
    
    exportInsights() {
        const insights = {
            timestamp: new Date().toISOString(),
            modelPerformance: this.predictionModel,
            trainingProgress: this.trainingProgress,
            fenceHealthAnalysis: Object.keys(this.fenceSystem.fenceData).map(fenceId => ({
                fenceId,
                name: this.fenceSystem.fenceData[fenceId].name,
                healthScore: this.fenceSystem.fenceData[fenceId].healthScore || 95,
                status: this.fenceSystem.fenceData[fenceId].status,
                alerts: this.fenceSystem.fenceData[fenceId].alerts
            })),
            maintenanceRecommendations: this.maintenanceQueue
        };
        
        const blob = new Blob([JSON.stringify(insights, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intellifence-ai-insights-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('AI insights exported successfully');
    }
    
    handleMaintenanceAction(button) {
        const action = button.textContent.toLowerCase();
        const maintenanceItem = button.closest('.maintenance-item');
        
        if (maintenanceItem) {
            const title = maintenanceItem.querySelector('h5').textContent;
            console.log(`${action} maintenance task: ${title}`);
            
            // Update button state
            button.textContent = action === 'assign team' ? 'Assigned' : 
                                action === 'schedule' ? 'Scheduled' : 'Planned';
            button.disabled = true;
            button.style.background = '#10b981';
        }
    }
    
    startAIProcessing() {
        // Simulate continuous AI processing
        setInterval(() => {
            // Update learning info
            const lastUpdate = document.querySelector('.learning-info .info-item:nth-child(2) span');
            if (lastUpdate) {
                const minutes = Math.floor(Math.random() * 60);
                lastUpdate.textContent = `Last Update: ${minutes} minutes ago`;
            }
            
            // Refresh pattern chart
            this.initializePatternChart();
        }, 30000); // Update every 30 seconds
    }
    
    // Method to be called when fence data changes
    onFenceDataUpdate(fenceId) {
        this.analyzeFenceHealth();
        console.log(`AI analysis updated for fence: ${fenceId}`);
    }
}

// Geographical Map Controller Class
class GeographicalMapController {
    constructor(fenceSystem) {
        this.fenceSystem = fenceSystem;
        this.isWeatherVisible = false;
        this.focusedFence = null;
        this.alertMode = false;
        
        this.initializeMapControls();
        this.setupMapInteractions();
        this.startMapUpdates();
        
        console.log('Geographical map controller initialized');
    }
    
    initializeMapControls() {
        // Show all fences button
        const showAllBtn = document.getElementById('showAllFences');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => {
                this.showAllFences();
                this.setActiveControl(showAllBtn);
            });
        }
        
        // Focus on alerts button
        const focusAlertsBtn = document.getElementById('focusAlerts');
        if (focusAlertsBtn) {
            focusAlertsBtn.addEventListener('click', () => {
                this.focusOnAlerts();
                this.setActiveControl(focusAlertsBtn);
            });
        }
        
        // Weather overlay button
        const weatherBtn = document.getElementById('weatherOverlay');
        if (weatherBtn) {
            weatherBtn.addEventListener('click', () => {
                this.toggleWeatherOverlay();
                this.setActiveControl(weatherBtn, this.isWeatherVisible);
            });
        }
    }
    
    setActiveControl(activeBtn, isActive = true) {
        // Remove active class from all controls
        document.querySelectorAll('.map-control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        if (isActive) {
            activeBtn.classList.add('active');
        }
    }
    
    showAllFences() {
        // Reset any focus effects
        this.focusedFence = null;
        this.alertMode = false;
        
        // Show all fence markers
        document.querySelectorAll('.fence-marker').forEach(marker => {
            marker.style.opacity = '1';
            marker.style.transform = 'scale(1)';
            marker.style.zIndex = '10';
        });
        
        // Update statistics to show all fences
        this.updateMapStatistics();
        
        console.log('Showing all fences');
    }
    
    focusOnAlerts() {
        this.alertMode = true;
        this.focusedFence = null;
        
        // Highlight fences with alerts and dim others
        document.querySelectorAll('.fence-marker').forEach(marker => {
            const fenceId = marker.dataset.fence;
            const fenceData = this.fenceSystem.fenceData[fenceId];
            
            if (fenceData && (fenceData.alerts.critical > 0 || fenceData.alerts.warning > 0)) {
                // Highlight alert fences
                marker.style.opacity = '1';
                marker.style.transform = 'scale(1.2)';
                marker.style.zIndex = '20';
                
                // Add alert animation
                marker.classList.add('alert-highlight');
            } else {
                // Dim normal fences
                marker.style.opacity = '0.4';
                marker.style.transform = 'scale(0.8)';
                marker.style.zIndex = '5';
                marker.classList.remove('alert-highlight');
            }
        });
        
        console.log('Focusing on alert zones');
    }
    
    toggleWeatherOverlay() {
        const weatherOverlay = document.getElementById('weatherOverlay');
        this.isWeatherVisible = !this.isWeatherVisible;
        
        if (weatherOverlay) {
            weatherOverlay.style.display = this.isWeatherVisible ? 'block' : 'none';
        }
        
        console.log(`Weather overlay ${this.isWeatherVisible ? 'shown' : 'hidden'}`);
    }
    
    setupMapInteractions() {
        // Add click handlers to fence markers
        document.querySelectorAll('.fence-marker').forEach(marker => {
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                const fenceId = marker.dataset.fence;
                this.focusOnFence(fenceId);
            });
            
            // Update tooltip content on hover
            marker.addEventListener('mouseenter', () => {
                this.updateMarkerTooltip(marker);
            });
        });
        
        // Add transmission line animations
        this.animateTransmissionLines();
    }
    
    focusOnFence(fenceId) {
        this.focusedFence = fenceId;
        this.alertMode = false;
        
        // Dim all markers first
        document.querySelectorAll('.fence-marker').forEach(marker => {
            marker.style.opacity = '0.3';
            marker.style.transform = 'scale(0.8)';
            marker.style.zIndex = '5';
            marker.classList.remove('alert-highlight');
        });
        
        // Highlight the focused fence
        const focusedMarker = document.querySelector(`[data-fence="${fenceId}"]`);
        if (focusedMarker) {
            focusedMarker.style.opacity = '1';
            focusedMarker.style.transform = 'scale(1.3)';
            focusedMarker.style.zIndex = '30';
            focusedMarker.classList.add('focused');
        }
        
        // Update map statistics for focused fence
        this.updateMapStatistics(fenceId);
        
        console.log(`Focused on fence: ${fenceId}`);
    }
    
    updateMarkerTooltip(marker) {
        const fenceId = marker.dataset.fence;
        const fenceData = this.fenceSystem.fenceData[fenceId];
        
        if (!fenceData) return;
        
        // Update tooltip values with current data
        const tooltip = marker.querySelector('.marker-tooltip');
        if (tooltip) {
            // Update voltage
            const voltageValue = tooltip.querySelector('.stat-item .value');
            if (voltageValue) {
                voltageValue.textContent = `${fenceData.voltage.toFixed(1)}V`;
                
                // Update voltage status
                if (fenceData.voltage < 220) {
                    voltageValue.classList.add('critical');
                } else if (fenceData.voltage < 230) {
                    voltageValue.classList.add('warning');
                } else {
                    voltageValue.classList.remove('warning', 'critical');
                }
            }
            
            // Update other values
            const statItems = tooltip.querySelectorAll('.stat-item');
            if (statItems.length >= 4) {
                statItems[1].querySelector('.value').textContent = `${fenceData.current.toFixed(1)}A`;
                statItems[2].querySelector('.value').textContent = `${fenceData.power.toFixed(1)}kW`;
                
                // Update health percentage
                const healthValue = statItems[3].querySelector('.value');
                const healthPercent = Math.round(95 + Math.random() * 5); // Simulate health
                healthValue.textContent = `${healthPercent}%`;
                
                // Update health status
                healthValue.className = 'value';
                if (healthPercent >= 95) {
                    healthValue.classList.add('health-excellent');
                } else if (healthPercent >= 85) {
                    healthValue.classList.add('health-good');
                } else {
                    healthValue.classList.add('health-warning');
                }
            }
        }
    }
    
    animateTransmissionLines() {
        // Add dynamic power flow animation based on load
        setInterval(() => {
            document.querySelectorAll('.transmission-line').forEach(line => {
                const animationSpeed = 2 + Math.random() * 2; // Vary speed based on load
                line.style.animationDuration = `${animationSpeed}s`;
            });
        }, 5000);
    }
    
    updateMapStatistics(focusedFenceId = null) {
        let totalFences = 0;
        let totalPower = 0;
        let healthSum = 0;
        let alertCount = 0;
        
        if (focusedFenceId) {
            // Show stats for focused fence only
            const fenceData = this.fenceSystem.fenceData[focusedFenceId];
            if (fenceData) {
                totalFences = 1;
                totalPower = fenceData.power;
                healthSum = 95 + Math.random() * 5; // Simulate health
                alertCount = fenceData.alerts.critical + fenceData.alerts.warning;
            }
        } else {
            // Show stats for all fences
            Object.values(this.fenceSystem.fenceData).forEach(fence => {
                totalFences++;
                totalPower += fence.power;
                healthSum += (95 + Math.random() * 5); // Simulate health
                alertCount += fence.alerts.critical + fence.alerts.warning;
            });
        }
        
        const avgHealth = totalFences > 0 ? Math.round(healthSum / totalFences) : 0;
        
        // Update stat cards
        const statCards = document.querySelectorAll('.map-statistics .stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-value').textContent = totalFences;
            statCards[1].querySelector('.stat-value').textContent = totalPower.toFixed(1);
            statCards[2].querySelector('.stat-value').textContent = `${avgHealth}%`;
            statCards[3].querySelector('.stat-value').textContent = alertCount;
        }
    }
    
    startMapUpdates() {
        // Update map data every 5 seconds
        setInterval(() => {
            this.updateMapData();
        }, 5000);
    }
    
    updateMapData() {
        // Update fence marker status based on current data
        document.querySelectorAll('.fence-marker').forEach(marker => {
            const fenceId = marker.dataset.fence;
            const fenceData = this.fenceSystem.fenceData[fenceId];
            
            if (!fenceData) return;
            
            // Update marker status class
            marker.className = `fence-marker ${fenceData.status}`;
            
            // Update status badge in tooltip
            const statusBadge = marker.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = `status-badge ${fenceData.status}`;
                statusBadge.textContent = fenceData.status.charAt(0).toUpperCase() + fenceData.status.slice(1);
            }
            
            // Update tooltip data
            this.updateMarkerTooltip(marker);
        });
        
        // Update statistics
        this.updateMapStatistics(this.focusedFence);
        
        // Update transmission line intensity based on power load
        this.updateTransmissionIntensity();
    }
    
    updateTransmissionIntensity() {
        const totalPower = Object.values(this.fenceSystem.fenceData).reduce((sum, fence) => sum + fence.power, 0);
        const averagePower = totalPower / Object.keys(this.fenceSystem.fenceData).length;
        
        // Adjust transmission line opacity based on power
        document.querySelectorAll('.transmission-line').forEach(line => {
            const intensity = Math.min(1, averagePower / 5); // Normalize to 0-1
            line.style.opacity = 0.6 + (intensity * 0.4); // 0.6 to 1.0 opacity
        });
    }
    
    // Method to be called when fence data changes
    onFenceDataUpdate(fenceId) {
        this.updateMapData();
        console.log(`Map updated for fence: ${fenceId}`);
    }
}

// Global functions for map interactions
window.focusOnFence = function(fenceId) {
    if (window.geoMapController) {
        window.geoMapController.focusOnFence(fenceId);
    }
};

// Add CSS for alert highlighting
const mapStyles = `
.fence-marker.alert-highlight {
    animation: alertBlink 1s infinite;
}

.fence-marker.focused {
    animation: focusPulse 2s infinite;
}

@keyframes alertBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.6; }
}

@keyframes focusPulse {
    0%, 100% { transform: scale(1.3); }
    50% { transform: scale(1.5); }
}
`;

// Add the map styles to the document
const mapStyleSheet = document.createElement('style');
mapStyleSheet.textContent = mapStyles;
document.head.appendChild(mapStyleSheet);

// Smart Alert Automation System
class SmartAlertAutomation {
    constructor() {
        this.alertRules = {
            critical: {
                powerFailure: { active: true, threshold: 0, escalationTime: '1min' },
                majorFault: { active: true, threshold: 95, escalationTime: '3min' },
                securityBreach: { active: true, threshold: 100, escalationTime: '30sec' }
            },
            warning: {
                maintenance: { active: true, threshold: 85, escalationTime: '1hour' },
                weatherAlert: { active: true, threshold: 75, escalationTime: '30min' },
                overload: { active: true, threshold: 90, escalationTime: '15min' }
            },
            smartResponse: {
                patternDetection: { active: true, learningMode: true },
                predictiveMaintenance: { active: true, threshold: 80 },
                autoHealing: { active: true, success: 78 }
            }
        };
        
        this.activeAlerts = [];
        this.communicationChannels = {
            sms: { status: 'online', sent24h: 127, delivered: 98.5, contacts: 15 },
            email: { status: 'online', sent24h: 89, delivered: 99.2, contacts: 22 },
            voice: { status: 'online', sent24h: 34, delivered: 94.7, contacts: 8 }
        };
        
        this.init();
    }

    init() {
        this.updateAutomationStatus();
        this.simulateRealTimeAlerts();
        this.updateCommunicationStats();
        this.setupEventListeners();
        
        // Start real-time updates
        setInterval(() => this.updateRealTimeData(), 5000);
    }

    updateAutomationStatus() {
        const automationIndicator = document.querySelector('.automation-indicator');
        if (automationIndicator) {
            const activeRulesCount = this.getActiveRulesCount();
            automationIndicator.innerHTML = `
                <div class="automation-pulse"></div>
                ${activeRulesCount} Rules Active
            `;
        }
    }

    getActiveRulesCount() {
        let count = 0;
        Object.values(this.alertRules).forEach(category => {
            Object.values(category).forEach(rule => {
                if (rule.active) count++;
            });
        });
        return count;
    }

    simulateRealTimeAlerts() {
        const alertScenarios = [
            {
                id: 'ALERT-001',
                type: 'critical',
                title: 'Transformer Overheating - T-KL-001',
                description: 'Temperature exceeded 85°C threshold at Ernakulam substation',
                fence: 'Ernakulam High Voltage',
                priority: 'critical',
                progress: 45,
                timeline: [
                    { time: '14:23', desc: 'Alert triggered by sensor T-001', status: 'completed' },
                    { time: '14:24', desc: 'SMS sent to maintenance team', status: 'completed' },
                    { time: '14:25', desc: 'Field engineer dispatched', status: 'active' },
                    { time: '14:30', desc: 'On-site assessment scheduled', status: 'pending' },
                    { time: '14:45', desc: 'Cooling system activation', status: 'pending' }
                ],
                eta: '15 min',
                actions: ['track', 'contact', 'approve']
            },
            {
                id: 'ALERT-002',
                type: 'warning',
                title: 'Unusual Power Consumption Pattern',
                description: 'AI detected 15% increase in off-peak consumption',
                fence: 'Kochi Industrial Zone',
                priority: 'medium',
                progress: 75,
                timeline: [
                    { time: '13:45', desc: 'Pattern anomaly detected by AI', status: 'completed' },
                    { time: '13:50', desc: 'Historical data analysis completed', status: 'completed' },
                    { time: '14:00', desc: 'Notification sent to grid operators', status: 'completed' },
                    { time: '14:15', desc: 'Load balancing adjustment', status: 'active' },
                    { time: '14:30', desc: 'Pattern monitoring continues', status: 'pending' }
                ],
                eta: '25 min',
                actions: ['details', 'schedule', 'defer']
            },
            {
                id: 'ALERT-003',
                type: 'info',
                title: 'Predictive Maintenance Scheduled',
                description: 'AI recommends maintenance for equipment showing early wear patterns',
                fence: 'Trivandrum Central',
                priority: 'low',
                progress: 90,
                timeline: [
                    { time: '12:30', desc: 'Predictive model identified wear pattern', status: 'completed' },
                    { time: '12:35', desc: 'Maintenance window calculated', status: 'completed' },
                    { time: '13:00', desc: 'Team notification sent', status: 'completed' },
                    { time: '14:00', desc: 'Resources allocated', status: 'completed' },
                    { time: '16:00', desc: 'Maintenance execution planned', status: 'active' }
                ],
                eta: '2 hours',
                actions: ['schedule', 'details']
            }
        ];

        this.activeAlerts = alertScenarios;
        this.renderAlertActivity();
    }

    renderAlertActivity() {
        const activityList = document.querySelector('.alert-activity-list');
        const activityCount = document.querySelector('.activity-count');
        
        if (!activityList || !activityCount) return;

        activityCount.textContent = `${this.activeAlerts.length} Active Alerts`;

        activityList.innerHTML = this.activeAlerts.map(alert => `
            <div class="activity-item ${alert.type}">
                <div class="activity-status">
                    <div class="status-icon">
                        <i class="fas ${this.getAlertIcon(alert.type)}"></i>
                    </div>
                    <div class="activity-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${alert.progress}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="activity-details">
                    <h5>${alert.title}</h5>
                    <p>${alert.description}</p>
                    
                    <div class="activity-timeline">
                        ${alert.timeline.map(event => `
                            <div class="timeline-event ${event.status}">
                                <span class="event-time">${event.time}</span>
                                <span class="event-desc">${event.desc}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="activity-meta">
                        <span class="priority-badge ${alert.priority}">${alert.priority}</span>
                        <span class="eta-badge">ETA ${alert.eta}</span>
                        <span class="ai-badge">AI Enhanced</span>
                    </div>
                </div>
                
                <div class="activity-actions">
                    ${alert.actions.map(action => `
                        <button class="action-btn ${action}" onclick="alertAutomation.handleAlertAction('${alert.id}', '${action}')">
                            <i class="fas ${this.getActionIcon(action)}"></i>
                            ${this.getActionLabel(action)}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    getAlertIcon(type) {
        const icons = {
            'critical': 'fa-exclamation-triangle',
            'warning': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-bell';
    }

    getActionIcon(action) {
        const icons = {
            'track': 'fa-map-marker-alt',
            'contact': 'fa-phone',
            'schedule': 'fa-calendar',
            'details': 'fa-info',
            'approve': 'fa-check',
            'defer': 'fa-clock'
        };
        return icons[action] || 'fa-cog';
    }

    getActionLabel(action) {
        const labels = {
            'track': 'Track',
            'contact': 'Contact',
            'schedule': 'Schedule',
            'details': 'Details',
            'approve': 'Approve',
            'defer': 'Defer'
        };
        return labels[action] || action;
    }

    updateCommunicationStats() {
        // Update SMS stats
        const smsStats = document.querySelectorAll('.channel-card.sms .stat-value');
        if (smsStats.length >= 3) {
            smsStats[0].textContent = this.communicationChannels.sms.sent24h;
            smsStats[1].textContent = `${this.communicationChannels.sms.delivered}%`;
            smsStats[2].textContent = this.communicationChannels.sms.contacts;
        }

        // Update Email stats
        const emailStats = document.querySelectorAll('.channel-card.email .stat-value');
        if (emailStats.length >= 3) {
            emailStats[0].textContent = this.communicationChannels.email.sent24h;
            emailStats[1].textContent = `${this.communicationChannels.email.delivered}%`;
            emailStats[2].textContent = this.communicationChannels.email.contacts;
        }

        // Update Voice stats
        const voiceStats = document.querySelectorAll('.channel-card.voice .stat-value');
        if (voiceStats.length >= 3) {
            voiceStats[0].textContent = this.communicationChannels.voice.sent24h;
            voiceStats[1].textContent = `${this.communicationChannels.voice.delivered}%`;
            voiceStats[2].textContent = this.communicationChannels.voice.contacts;
        }
    }

    handleAlertAction(alertId, action) {
        const alert = this.activeAlerts.find(a => a.id === alertId);
        if (!alert) return;

        switch(action) {
            case 'track':
                this.trackAlert(alert);
                break;
            case 'contact':
                this.contactTeam(alert);
                break;
            case 'schedule':
                this.scheduleAction(alert);
                break;
            case 'details':
                this.showDetails(alert);
                break;
            case 'approve':
                this.approveAction(alert);
                break;
            case 'defer':
                this.deferAlert(alert);
                break;
        }
    }

    trackAlert(alert) {
        // Simulate tracking functionality
        window.fenceSelector.selectFence(alert.fence);
        
        // Show tracking notification
        this.showNotification(`Tracking alert ${alert.id} on ${alert.fence}`, 'info');
        
        // Update alert progress
        alert.progress = Math.min(alert.progress + 10, 100);
        this.renderAlertActivity();
    }

    contactTeam(alert) {
        // Simulate contacting team
        const contactMethod = alert.type === 'critical' ? 'Voice Call' : 'SMS';
        this.showNotification(`${contactMethod} initiated for ${alert.title}`, 'success');
        
        // Update communication stats
        if (contactMethod === 'Voice Call') {
            this.communicationChannels.voice.sent24h++;
        } else {
            this.communicationChannels.sms.sent24h++;
        }
        this.updateCommunicationStats();
    }

    scheduleAction(alert) {
        // Simulate scheduling
        const scheduleTime = new Date(Date.now() + 30 * 60000); // 30 minutes from now
        this.showNotification(`Action scheduled for ${scheduleTime.toLocaleTimeString()} - ${alert.title}`, 'info');
        
        // Add timeline event
        alert.timeline.push({
            time: new Date().toLocaleTimeString().substring(0, 5),
            desc: 'Action scheduled by operator',
            status: 'completed'
        });
        this.renderAlertActivity();
    }

    showDetails(alert) {
        // Simulate showing detailed information
        const detailsWindow = window.open('', '_blank', 'width=600,height=400');
        detailsWindow.document.write(`
            <html>
                <head>
                    <title>Alert Details - ${alert.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; }
                        .header { background: #1e40af; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                        .detail-section { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .status-${alert.type} { border-left: 4px solid ${alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6'}; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>${alert.title}</h2>
                        <p>Alert ID: ${alert.id} | Priority: ${alert.priority.toUpperCase()}</p>
                    </div>
                    <div class="detail-section status-${alert.type}">
                        <h3>Description</h3>
                        <p>${alert.description}</p>
                        <p><strong>Fence:</strong> ${alert.fence}</p>
                        <p><strong>Progress:</strong> ${alert.progress}%</p>
                        <p><strong>ETA:</strong> ${alert.eta}</p>
                    </div>
                    <div class="detail-section">
                        <h3>Timeline</h3>
                        ${alert.timeline.map(event => `
                            <p><strong>${event.time}:</strong> ${event.desc} <em>(${event.status})</em></p>
                        `).join('')}
                    </div>
                </body>
            </html>
        `);
    }

    approveAction(alert) {
        // Simulate approving an action
        this.showNotification(`Action approved for ${alert.title}`, 'success');
        
        // Update progress to completion
        alert.progress = 100;
        alert.timeline.push({
            time: new Date().toLocaleTimeString().substring(0, 5),
            desc: 'Action approved and executed',
            status: 'completed'
        });
        this.renderAlertActivity();
        
        // Remove from active alerts after 3 seconds
        setTimeout(() => {
            this.activeAlerts = this.activeAlerts.filter(a => a.id !== alert.id);
            this.renderAlertActivity();
        }, 3000);
    }

    deferAlert(alert) {
        // Simulate deferring an alert
        const deferTime = '1 hour';
        this.showNotification(`Alert ${alert.id} deferred for ${deferTime}`, 'warning');
        
        // Add timeline event
        alert.timeline.push({
            time: new Date().toLocaleTimeString().substring(0, 5),
            desc: `Alert deferred for ${deferTime}`,
            status: 'completed'
        });
        this.renderAlertActivity();
    }

    updateRealTimeData() {
        // Simulate real-time updates to alert progress
        this.activeAlerts.forEach(alert => {
            if (alert.progress < 100 && Math.random() > 0.7) {
                alert.progress = Math.min(alert.progress + Math.floor(Math.random() * 5), 100);
                
                // Occasionally add new timeline events
                if (Math.random() > 0.9) {
                    const randomEvents = [
                        'Status update received',
                        'Equipment check completed',
                        'Team coordination updated',
                        'Safety protocols verified',
                        'Remote monitoring active'
                    ];
                    alert.timeline.push({
                        time: new Date().toLocaleTimeString().substring(0, 5),
                        desc: randomEvents[Math.floor(Math.random() * randomEvents.length)],
                        status: 'completed'
                    });
                }
            }
        });
        
        // Update communication channel stats
        if (Math.random() > 0.8) {
            this.communicationChannels.sms.sent24h += Math.floor(Math.random() * 3);
            this.communicationChannels.email.sent24h += Math.floor(Math.random() * 2);
            this.communicationChannels.voice.sent24h += Math.floor(Math.random() * 1);
            this.updateCommunicationStats();
        }
        
        this.renderAlertActivity();
    }

    setupEventListeners() {
        // Setup configuration panel interactions
        const checkboxes = document.querySelectorAll('.option-label input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleConfigChange(e.target);
            });
        });

        // Setup timing controls
        const timingSelects = document.querySelectorAll('.timing-select');
        timingSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleTimingChange(e.target);
            });
        });

        // Setup configuration buttons
        const saveBtn = document.querySelector('.config-btn.primary');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveConfiguration());
        }

        const resetBtn = document.querySelector('.config-btn.secondary');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetConfiguration());
        }
    }

    handleConfigChange(checkbox) {
        const configType = checkbox.getAttribute('data-config');
        const isChecked = checkbox.checked;
        
        this.showNotification(`${configType} ${isChecked ? 'enabled' : 'disabled'}`, 'info');
    }

    handleTimingChange(select) {
        const timingType = select.getAttribute('data-timing');
        const value = select.value;
        
        this.showNotification(`${timingType} updated to ${value}`, 'info');
    }

    saveConfiguration() {
        this.showNotification('Alert automation configuration saved successfully', 'success');
        this.updateAutomationStatus();
    }

    resetConfiguration() {
        this.showNotification('Alert automation configuration reset to defaults', 'info');
        
        // Reset all checkboxes to default state
        const checkboxes = document.querySelectorAll('.option-label input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true; // Assuming default is enabled
        });
        
        // Reset timing selects to default
        const timingSelects = document.querySelectorAll('.timing-select');
        timingSelects.forEach(select => {
            select.selectedIndex = 0;
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            maxWidth: '400px',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
}

// Performance Analytics System
class PerformanceAnalyticsSystem {
    constructor(fenceSystem) {
        this.fenceSystem = fenceSystem;
        this.charts = {};
        this.kpiData = {
            efficiency: { current: 92.4, target: 95, trend: 2.3 },
            reliability: { current: 98.7, target: 99, trend: 0.8 },
            optimization: { current: 92.4, target: 95.0, trend: 15.6 },
            maintenance: { current: 88.2, target: 90, trend: -1.2 }
        };
        
        this.performanceData = {
            powerQuality: this.generateTimeSeriesData(24, 'power'),
            efficiency: this.generateEfficiencyData(),
            loadDistribution: this.generateLoadData(),
            faultAnalysis: this.generateFaultData()
        };
        
        this.init();
    }

    init() {
        this.initializePerformanceAnalytics();
        this.createPerformanceCharts();
        this.updateKPIs();
        this.startPerformanceMonitoring();
        this.setupPerformanceExport();
        this.initializeComparison();
        
        console.log('Performance Analytics System initialized');
    }

    initializePerformanceAnalytics() {
        // Set up analytics controls
        this.setupAnalyticsControls();
        
        // Initialize data refresh
        this.refreshPerformanceData();
    }

    setupAnalyticsControls() {
        const timeRangeSelect = document.querySelector('.analytics-select');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.updateTimeRange(e.target.value);
            });
        }

        const exportBtn = document.querySelector('.analytics-btn.export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showExportModal();
            });
        }

        const compareBtn = document.querySelector('.analytics-btn.compare');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.toggleComparison();
            });
        }
    }

    createPerformanceCharts() {
        console.log('🎯 Creating Performance Analytics Charts...');
        
        // Verify Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js is not loaded!');
            return;
        }
        
        // Initialize performance data if not already done
        if (!this.performanceData.powerQuality) {
            this.performanceData.powerQuality = this.generateTimeSeriesData(24, 'power');
        }
        
        // Create charts with error handling
        try {
            this.createPowerQualityChart();
            this.createEfficiencyChart();
            this.createLoadDistributionChart();
            this.createFaultAnalysisChart();
            this.createComparisonChart();
            
            console.log('✅ All performance charts created successfully');
        } catch (error) {
            console.error('❌ Error creating performance charts:', error);
        }
    }

    createPowerQualityChart() {
        const ctx = document.getElementById('powerQualityChart');
        if (!ctx) {
            console.error('❌ powerQualityChart canvas not found');
            return;
        }

        console.log('📊 Creating Power Quality Chart...');
        
        try {
            this.charts.powerQuality = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.generateTimeLabels(24),
                    datasets: [
                        {
                            label: 'Voltage (kV)',
                            data: this.performanceData.powerQuality.voltage,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Current (A)',
                            data: this.performanceData.powerQuality.current,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Power (MW)',
                            data: this.performanceData.powerQuality.power,
                            borderColor: '#f59e0b',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Power Quality Trends (24 Hours)',
                            font: { size: 16 }
                        },
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: '#f3f4f6'
                            }
                        },
                        x: {
                            grid: {
                                color: '#f3f4f6'
                            }
                        }
                    }
                }
            });
            
            console.log('✅ Power Quality Chart created successfully');
        } catch (error) {
            console.error('❌ Error creating Power Quality Chart:', error);
        }
    }

    createEfficiencyChart() {
        const ctx = document.getElementById('efficiencyChart');
        if (!ctx) {
            console.error('❌ efficiencyChart canvas not found');
            return;
        }

        console.log('📊 Creating Efficiency Chart...');
        
        try {
            this.charts.efficiency = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Transmission', 'Distribution', 'Conversion', 'Loss'],
                    datasets: [{
                        data: [82, 91, 87, 13],
                        backgroundColor: [
                            '#3b82f6',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444'
                        ],
                        borderWidth: 3,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        title: {
                            display: true,
                            text: 'System Efficiency Breakdown',
                            font: { size: 16 }
                        },
                        legend: {
                            position: 'bottom'
                        }
                    },
                    animation: {
                        animateRotate: true,
                        duration: 1500
                    }
                }
            });
            
            console.log('✅ Efficiency Chart created successfully');
        } catch (error) {
            console.error('❌ Error creating Efficiency Chart:', error);
        }
        
        // Update efficiency breakdown
        this.updateEfficiencyBreakdown();
    }

    createLoadDistributionChart() {
        const ctx = document.getElementById('loadDistributionChart');
        if (!ctx) {
            console.error('❌ loadDistributionChart canvas not found');
            return;
        }

        console.log('📊 Creating Load Distribution Chart...');
        
        try {
            this.charts.loadDistribution = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Residential', 'Industrial', 'Commercial'],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: [
                            '#3b82f6',
                            '#10b981',
                            '#f59e0b'
                        ],
                        borderWidth: 3,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Load Distribution by Sector',
                            font: { size: 16 }
                        },
                        legend: {
                            position: 'bottom'
                        }
                    },
                    animation: {
                        animateRotate: true,
                        duration: 1500
                    }
                }
            });
            
            console.log('✅ Load Distribution Chart created successfully');
        } catch (error) {
            console.error('❌ Error creating Load Distribution Chart:', error);
        }

        this.updateLoadBreakdown();
        this.updateLoadSummary();
    }

    createFaultAnalysisChart() {
        const ctx = document.getElementById('faultAnalysisChart');
        if (!ctx) {
            console.error('❌ faultAnalysisChart canvas not found');
            return;
        }

        console.log('📊 Creating Fault Analysis Chart...');
        
        try {
            this.charts.faultAnalysis = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Equipment Failure',
                            data: [5, 3, 7, 2, 4, 6],
                            backgroundColor: '#ef4444',
                            borderRadius: 4
                        },
                        {
                            label: 'Weather Related',
                            data: [8, 12, 4, 15, 9, 11],
                            backgroundColor: '#f59e0b',
                            borderRadius: 4
                        },
                        {
                            label: 'Human Error',
                            data: [2, 1, 3, 1, 2, 4],
                            backgroundColor: '#6b7280',
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Fault Analysis by Category',
                            font: { size: 16 }
                        },
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#f3f4f6'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
            
            console.log('✅ Fault Analysis Chart created successfully');
        } catch (error) {
            console.error('❌ Error creating Fault Analysis Chart:', error);
        }

        this.updateFaultStatistics();
        this.updateFaultCategories();
    }

    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx) {
            console.error('❌ comparisonChart canvas not found');
            return;
        }

        console.log('📊 Creating Comparison Chart...');
        
        try {
            this.charts.comparison = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Efficiency', 'Reliability', 'Performance', 'Maintenance', 'Safety'],
                    datasets: [
                        {
                            label: 'Trivandrum',
                            data: [85, 92, 78, 88, 95],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            pointBackgroundColor: '#3b82f6',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2
                        },
                        {
                            label: 'Kochi',
                            data: [78, 85, 82, 75, 89],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            pointBackgroundColor: '#10b981',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2
                        },
                        {
                            label: 'Kozhikode',
                            data: [92, 88, 75, 82, 91],
                            borderColor: '#f59e0b',
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            pointBackgroundColor: '#f59e0b',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Performance Comparison - Kerala Regions',
                            font: { size: 16 }
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: '#e5e7eb'
                            },
                            pointLabels: {
                                font: {
                                    size: 12
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 1500,
                        easing: 'easeInOutQuart'
                    }
                }
            });
            
            console.log('✅ Comparison Chart created successfully');
        } catch (error) {
            console.error('❌ Error creating Comparison Chart:', error);
        }

        this.updatePerformanceRanking();
        this.updatePerformanceInsights();
    }

    updateKPIs() {
        // Grid Efficiency
        this.animateKPIProgress('.kpi-card.efficiency .progress-fill', this.kpiData.efficiency.current);
        document.querySelector('.kpi-card.efficiency .primary-metric').textContent = 
            this.kpiData.efficiency.current.toFixed(1) + '%';
        this.updateTrendIndicator('.kpi-card.efficiency', this.kpiData.efficiency.trend);
        
        // System Reliability
        this.animateKPIProgress('.kpi-card.reliability .progress-fill', this.kpiData.reliability.current);
        document.querySelector('.kpi-card.reliability .primary-metric').textContent = 
            this.kpiData.reliability.current.toFixed(1) + '%';
        this.updateTrendIndicator('.kpi-card.reliability', this.kpiData.reliability.trend);
        
        // Optimization Score
        this.animateKPIProgress('.kpi-card.optimization .progress-fill', 
            (this.kpiData.optimization.current / this.kpiData.optimization.target) * 100);
        document.querySelector('.kpi-card.optimization .primary-metric').textContent = 
            this.kpiData.optimization.current.toFixed(1) + '%';
        this.updateTrendIndicator('.kpi-card.optimization', this.kpiData.optimization.trend);
        
        // Maintenance Score
        this.animateKPIProgress('.kpi-card.maintenance .progress-fill', this.kpiData.maintenance.current);
        document.querySelector('.kpi-card.maintenance .primary-metric').textContent = 
            this.kpiData.maintenance.current.toFixed(1);
        this.updateTrendIndicator('.kpi-card.maintenance', this.kpiData.maintenance.trend);
    }

    animateKPIProgress(selector, percentage) {
        const element = document.querySelector(selector);
        if (element) {
            let current = 0;
            const increment = percentage / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= percentage) {
                    current = percentage;
                    clearInterval(timer);
                }
                element.style.width = current + '%';
            }, 20);
        }
    }

    updateTrendIndicator(cardSelector, trend) {
        const card = document.querySelector(cardSelector);
        if (!card) return;

        const indicator = card.querySelector('.trend-indicator');
        if (!indicator) return;

        const icon = indicator.querySelector('i');
        const value = indicator.querySelector('span') || indicator.childNodes[1];

        if (Math.abs(trend) < 0.5) {
            icon.className = 'fas fa-minus';
            indicator.className = 'trend-indicator';
        } else if (trend > 0) {
            icon.className = 'fas fa-arrow-up';
            indicator.className = 'trend-indicator positive';
        } else {
            icon.className = 'fas fa-arrow-down';
            indicator.className = 'trend-indicator negative';
        }

        if (value) {
            value.textContent = `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`;
        }
    }

    updateEfficiencyBreakdown() {
        const breakdowns = [
            { value: 95, selector: '.breakdown-item:nth-child(1)' },
            { value: 89, selector: '.breakdown-item:nth-child(2)' },
            { value: 92, selector: '.breakdown-item:nth-child(3)' },
            { value: 87, selector: '.breakdown-item:nth-child(4)' }
        ];

        breakdowns.forEach((breakdown, index) => {
            setTimeout(() => {
                const item = document.querySelector(breakdown.selector);
                if (item) {
                    const fill = item.querySelector('.breakdown-fill');
                    const value = item.querySelector('.breakdown-value');
                    
                    if (fill) {
                        this.animateProgress(fill, breakdown.value);
                    }
                    if (value) {
                        value.textContent = breakdown.value + '%';
                    }
                }
            }, index * 200);
        });
    }

    updateLoadBreakdown() {
        const loadData = [
            { type: 'residential', percentage: 45, value: 103.5 },
            { type: 'industrial', percentage: 35, value: 80.5 },
            { type: 'commercial', percentage: 20, value: 46.0 }
        ];

        loadData.forEach(load => {
            const item = document.querySelector(`.load-item .load-color.${load.type}`);
            if (item) {
                const loadItem = item.closest('.load-item');
                const percentage = loadItem.querySelector('.load-percentage');
                
                if (percentage) {
                    percentage.textContent = `${load.percentage}% (${load.value} MW)`;
                }
            }
        });
    }

    updateLoadSummary() {
        const totalValue = document.querySelector('.load-total .total-value');
        const totalUnit = document.querySelector('.load-total .total-unit');
        
        if (totalValue) {
            totalValue.textContent = '230.0';
        }
        if (totalUnit) {
            totalUnit.textContent = 'MW Total Load';
        }
    }

    updateFaultStatistics() {
        const stats = [
            { value: 27 },
            { value: 5 },
            { value: 22 }
        ];

        const statItems = document.querySelectorAll('.fault-stats .stat-item');
        stats.forEach((stat, index) => {
            if (statItems[index]) {
                const value = statItems[index].querySelector('.stat-value');
                if (value) {
                    value.textContent = stat.value;
                }
            }
        });

        const trendValue = document.querySelector('.fault-trend .trend-value');
        const trendLabel = document.querySelector('.fault-trend .trend-label');
        
        if (trendValue && trendLabel) {
            trendValue.textContent = '-12%';
            trendValue.className = 'trend-value negative';
            trendLabel.textContent = 'vs last month';
        }
    }

    updateFaultCategories() {
        const categories = [
            { count: 15, percentage: 35 },
            { count: 19, percentage: 45 },
            { count: 8, percentage: 20 }
        ];

        categories.forEach((category, index) => {
            const categoryEl = document.querySelector(`.fault-category:nth-child(${index + 1})`);
            if (categoryEl) {
                const count = categoryEl.querySelector('.category-count');
                const fill = categoryEl.querySelector('.category-fill');
                
                if (count) {
                    count.textContent = category.count;
                }
                if (fill) {
                    setTimeout(() => {
                        this.animateProgress(fill, category.percentage);
                    }, index * 300);
                }
            }
        });
    }

    updatePerformanceRanking() {
        const rankings = [
            { rank: 1, fence: 'Kozhikode Central', metric: '94.2%' },
            { rank: 2, fence: 'Trivandrum South', metric: '92.8%' },
            { rank: 3, fence: 'Kochi Industrial', metric: '89.5%' },
            { rank: 4, fence: 'Ernakulam Grid', metric: '87.3%' }
        ];

        rankings.forEach((item, index) => {
            const rankingItem = document.querySelector(`.ranking-item:nth-child(${index + 1})`);
            if (rankingItem) {
                const rank = rankingItem.querySelector('.rank');
                const fenceName = rankingItem.querySelector('.fence-name');
                const metricValue = rankingItem.querySelector('.metric-value');
                
                if (rank) rank.textContent = item.rank;
                if (fenceName) fenceName.textContent = item.fence;
                if (metricValue) metricValue.textContent = item.metric;
            }
        });
    }

    updatePerformanceInsights() {
        const insights = [
            'Kozhikode sector shows 15% improvement in efficiency metrics',
            'Predictive maintenance reduced downtime by 23% this quarter',
            'Weather-related incidents decreased by 31% with new monitoring'
        ];

        insights.forEach((insight, index) => {
            const insightItem = document.querySelector(`.insight-item:nth-child(${index + 1}) span`);
            if (insightItem) {
                insightItem.textContent = insight;
            }
        });
    }

    animateProgress(element, percentage) {
        if (!element) return;
        
        let current = 0;
        const increment = percentage / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= percentage) {
                current = percentage;
                clearInterval(timer);
            }
            element.style.width = current + '%';
        }, 25);
    }

    startPerformanceMonitoring() {
        setInterval(() => {
            this.updatePerformanceData();
        }, 30000);

        setInterval(() => {
            this.updateKPIValues();
        }, 60000);
    }

    updatePerformanceData() {
        if (this.charts.powerQuality) {
            const newData = this.generateTimeSeriesData(24, 'power');
            this.charts.powerQuality.data.datasets[0].data = newData.voltage;
            this.charts.powerQuality.data.datasets[1].data = newData.current;
            this.charts.powerQuality.data.datasets[2].data = newData.power;
            this.charts.powerQuality.update('none');
        }

        if (this.charts.faultAnalysis) {
            const datasets = this.charts.faultAnalysis.data.datasets;
            datasets.forEach(dataset => {
                dataset.data = dataset.data.map(() => Math.floor(Math.random() * 15) + 1);
            });
            this.charts.faultAnalysis.update('none');
            this.updateFaultStatistics();
        }
    }

    updateKPIValues() {
        Object.keys(this.kpiData).forEach(key => {
            const kpi = this.kpiData[key];
            kpi.current += (Math.random() - 0.5) * 1;
            kpi.trend = (Math.random() - 0.5) * 5;
            
            if (key === 'efficiency' || key === 'reliability') {
                kpi.current = Math.max(85, Math.min(99, kpi.current));
            } else if (key === 'costSavings') {
                kpi.current = Math.max(1.5, Math.min(4, kpi.current));
            } else if (key === 'maintenance') {
                kpi.current = Math.max(75, Math.min(95, kpi.current));
            }
        });

        this.updateKPIs();
    }

    generateTimeSeriesData(hours, type) {
        const data = { voltage: [], current: [], power: [] };
        
        for (let i = 0; i < hours; i++) {
            const hour = i;
            const isPeakHour = (hour >= 18 && hour <= 22) || (hour >= 6 && hour <= 9);
            
            let baseVoltage = 230 + (isPeakHour ? -5 : 5);
            let baseCurrent = 15 + (isPeakHour ? 8 : -3);
            let basePower = 60 + (isPeakHour ? 20 : -10);
            
            data.voltage.push(baseVoltage + (Math.random() - 0.5) * 10);
            data.current.push(Math.max(0, baseCurrent + (Math.random() - 0.5) * 6));
            data.power.push(Math.max(0, basePower + (Math.random() - 0.5) * 15));
        }
        
        return data;
    }

    generateTimeLabels(hours) {
        const labels = [];
        const now = new Date();
        for (let i = hours - 1; i >= 0; i--) {
            const time = new Date(now - i * 60 * 60 * 1000);
            labels.push(time.getHours().toString().padStart(2, '0') + ':00');
        }
        return labels;
    }

    setupPerformanceExport() {
        const exportModal = document.querySelector('.export-modal');
        const closeBtn = document.querySelector('.export-modal .close-btn');
        const cancelBtn = document.querySelector('.modal-btn.secondary');
        const exportConfirmBtn = document.querySelector('.modal-btn.primary');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideExportModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideExportModal());
        }
        
        if (exportConfirmBtn) {
            exportConfirmBtn.addEventListener('click', () => {
                this.exportPerformanceReport();
                this.hideExportModal();
            });
        }

        if (exportModal) {
            exportModal.addEventListener('click', (e) => {
                if (e.target === exportModal) this.hideExportModal();
            });
        }
    }

    showExportModal() {
        const modal = document.querySelector('.export-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideExportModal() {
        const modal = document.querySelector('.export-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    exportPerformanceReport() {
        const reportType = document.querySelector('input[name="reportType"]:checked')?.value || 'summary';
        const timePeriod = document.querySelector('input[name="timePeriod"]:checked')?.value || 'month';
        const format = document.querySelector('input[name="format"]:checked')?.value || 'pdf';

        const reportData = this.generateReportData(reportType, timePeriod);
        
        if (format === 'csv') {
            this.downloadCSVReport(reportData, reportType, timePeriod);
        } else {
            this.downloadJSONReport(reportData, reportType, timePeriod, format);
        }

        this.showExportNotification(format, reportType);
    }

    generateReportData(type, period) {
        return {
            timestamp: new Date().toISOString(),
            type: type,
            period: period,
            kpis: this.kpiData,
            faultAnalysis: {
                total: 27,
                critical: 5,
                resolved: 22
            }
        };
    }

    downloadCSVReport(data, type, period) {
        const headers = ['Metric', 'Value', 'Unit', 'Trend'];
        const rows = [
            ['Grid Efficiency', data.kpis.efficiency.current.toFixed(1), '%', data.kpis.efficiency.trend.toFixed(1) + '%'],
            ['System Reliability', data.kpis.reliability.current.toFixed(1), '%', data.kpis.reliability.trend.toFixed(1) + '%'],
            ['Cost Savings', data.kpis.costSavings.current.toFixed(1), 'Million ₹', data.kpis.costSavings.trend.toFixed(1) + '%'],
            ['Maintenance Score', data.kpis.maintenance.current.toFixed(1), 'Points', data.kpis.maintenance.trend.toFixed(1) + '%']
        ];

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        this.downloadFile(csv, `performance-report-${type}-${period}-${Date.now()}.csv`, 'text/csv');
    }

    downloadJSONReport(data, type, period, format) {
        const jsonData = JSON.stringify(data, null, 2);
        this.downloadFile(jsonData, `performance-report-${type}-${period}-${Date.now()}.json`, 'application/json');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showExportNotification(format, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${format.toUpperCase()} report exported successfully!</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    initializeComparison() {
        const compareBtn = document.querySelector('.analytics-btn.compare');
        
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.toggleComparison();
            });
        }
    }

    toggleComparison() {
        const compareBtn = document.querySelector('.analytics-btn.compare');
        const comparativeSection = document.querySelector('.comparative-analysis');
        
        if (!compareBtn || !comparativeSection) return;

        compareBtn.classList.toggle('active');
        
        if (compareBtn.classList.contains('active')) {
            comparativeSection.style.display = 'block';
            setTimeout(() => {
                comparativeSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        } else {
            comparativeSection.style.display = 'none';
        }
    }

    updateTimeRange(range) {
        console.log(`Updating performance analytics for time range: ${range}`);
        
        const hours = range === 'hour' ? 1 : range === 'day' ? 24 : range === 'week' ? 168 : 720;
        const newData = this.generateTimeSeriesData(Math.min(hours, 24), 'power');
        
        if (this.charts.powerQuality) {
            this.charts.powerQuality.data.labels = this.generateTimeLabels(Math.min(hours, 24));
            this.charts.powerQuality.data.datasets[0].data = newData.voltage;
            this.charts.powerQuality.data.datasets[1].data = newData.current;
            this.charts.powerQuality.data.datasets[2].data = newData.power;
            this.charts.powerQuality.update();
        }
    }

    refreshPerformanceData() {
        this.updatePerformanceData();
        this.updateKPIValues();
        
        console.log('Performance analytics data refreshed');
    }
}

// Test function for debugging chart creation
window.testPerformanceCharts = function() {
    console.log('🧪 Testing Performance Analytics Charts...');
    
    // Check if Chart.js is loaded
    console.log('Chart.js available:', typeof Chart !== 'undefined', Chart.version || 'unknown');
    
    // Check if main system is available
    console.log('IntelliFence System available:', !!window.intelliFenceSystem);
    
    // Check if performance analytics is available
    console.log('Performance Analytics available:', !!window.performanceAnalytics);
    
    // Check if canvas elements exist
    const canvasIds = ['powerQualityChart', 'efficiencyChart', 'loadDistributionChart', 'faultAnalysisChart', 'comparisonChart'];
    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        console.log(`Canvas ${id}:`, !!canvas, canvas ? `${canvas.width}x${canvas.height}` : 'not found');
    });
    
    // Try to recreate charts if performance analytics exists
    if (window.performanceAnalytics) {
        console.log('🔄 Recreating charts...');
        try {
            window.performanceAnalytics.createPerformanceCharts();
            console.log('✅ Charts recreation attempt completed');
        } catch (error) {
            console.error('❌ Error recreating charts:', error);
        }
    }
};

// Initialize Performance Analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for main system and Chart.js to be ready
    const initPerformanceAnalytics = () => {
        if (typeof Chart !== 'undefined' && window.intelliFenceSystem) {
            try {
                window.performanceAnalytics = new PerformanceAnalyticsSystem(window.intelliFenceSystem);
                console.log('✅ Performance Analytics System started!');
            } catch (error) {
                console.error('❌ Error initializing Performance Analytics:', error);
                // Retry after a short delay
                setTimeout(initPerformanceAnalytics, 1000);
            }
        } else {
            console.log('⏳ Waiting for Chart.js and IntelliFence System...');
            setTimeout(initPerformanceAnalytics, 500);
        }
    };
    
    // Start initialization with a delay to ensure all dependencies are loaded
    setTimeout(initPerformanceAnalytics, 2000);
});

// Multi-Wave Visualization System
class MultiWaveVisualization {
    constructor() {
        this.waves = {
            voltage: { amplitude: 1, frequency: 1, phase: 0, color: '#3498db' },
            current: { amplitude: 0.8, frequency: 1.2, phase: Math.PI/4, color: '#27ae60' },
            power: { amplitude: 0.6, frequency: 0.8, phase: Math.PI/2, color: '#f39c12' },
            harmonics: { amplitude: 0.4, frequency: 2.5, phase: Math.PI/6, color: '#9b59b6' }
        };
        this.time = 0;
        this.animationId = null;
        this.isRunning = false;
        this.initializeWaves();
    }

    initializeWaves() {
        const waveContainer = document.querySelector('.wave-container');
        if (!waveContainer) {
            console.log('Wave container not found, retrying...');
            setTimeout(() => this.initializeWaves(), 500);
            return;
        }

        this.updateWaveData();
        this.startAnimation();
        this.connectToRealTimeData();
    }

    generateWavePath(waveType, points = 100) {
        const wave = this.waves[waveType];
        if (!wave) return '';

        let path = '';
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * 200; // SVG viewBox width
            const angle = (x / 200) * 4 * Math.PI * wave.frequency + wave.phase + this.time;
            const y = 50 + wave.amplitude * 20 * Math.sin(angle); // Center at 50, amplitude scaled
            
            if (i === 0) {
                path += `M${x},${y}`;
            } else {
                path += ` L${x},${y}`;
            }
        }
        return path;
    }

    updateWaveData() {
        Object.keys(this.waves).forEach(waveType => {
            const pathElement = document.getElementById(`wave-${waveType}`);
            if (pathElement) {
                const newPath = this.generateWavePath(waveType);
                pathElement.setAttribute('d', newPath);
            }
        });
    }

    updateWaveAmplitudes(data) {
        // Update wave amplitudes based on real-time electrical data
        if (data.voltage) {
            this.waves.voltage.amplitude = Math.max(0.2, Math.min(1.5, data.voltage / 240));
        }
        if (data.current) {
            this.waves.current.amplitude = Math.max(0.2, Math.min(1.2, data.current / 20));
        }
        if (data.power) {
            this.waves.power.amplitude = Math.max(0.2, Math.min(1.0, data.power / 5000));
        }
        if (data.harmonics) {
            this.waves.harmonics.amplitude = Math.max(0.1, Math.min(0.8, data.harmonics / 10));
        }

        // Update legend indicators
        this.updateLegendIndicators(data);
    }

    updateLegendIndicators(data) {
        const indicators = {
            voltage: data.voltage ? `${data.voltage.toFixed(1)}V` : '230.5V',
            current: data.current ? `${data.current.toFixed(1)}A` : '15.2A',
            power: data.power ? `${(data.power/1000).toFixed(1)}kW` : '3.5kW',
            harmonics: data.harmonics ? `${data.harmonics.toFixed(1)}%` : '2.1%'
        };

        Object.keys(indicators).forEach(type => {
            const valueElement = document.querySelector(`.wave-legend .legend-item[data-wave="${type}"] .wave-value`);
            if (valueElement) {
                valueElement.textContent = indicators[type];
            }

            const statusElement = document.querySelector(`.wave-legend .legend-item[data-wave="${type}"] .status-indicator`);
            if (statusElement) {
                const value = data[type];
                let status = 'normal';
                
                if (type === 'voltage' && value) {
                    status = (value < 220 || value > 250) ? 'warning' : 'normal';
                } else if (type === 'current' && value) {
                    status = value > 18 ? 'warning' : 'normal';
                } else if (type === 'harmonics' && value) {
                    status = value > 5 ? 'warning' : 'normal';
                }
                
                statusElement.className = `status-indicator ${status}`;
            }
        });
    }

    connectToRealTimeData() {
        // Connect to existing real-time data system
        if (window.intelliFenceSystem) {
            setInterval(() => {
                const currentData = {
                    voltage: window.intelliFenceSystem.voltageValue || 230.5,
                    current: window.intelliFenceSystem.currentValue || 15.2,
                    power: (window.intelliFenceSystem.voltageValue || 230.5) * (window.intelliFenceSystem.currentValue || 15.2),
                    harmonics: 2.1 + Math.random() * 2
                };
                this.updateWaveAmplitudes(currentData);
            }, 2000);
        }
    }

    startAnimation() {
        if (this.isRunning) return;
        this.isRunning = true;

        const animate = () => {
            this.time += 0.05;
            this.updateWaveData();
            
            if (this.isRunning) {
                this.animationId = requestAnimationFrame(animate);
            }
        };

        animate();
    }

    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    adjustWaveFrequency(waveType, frequency) {
        if (this.waves[waveType]) {
            this.waves[waveType].frequency = frequency;
        }
    }

    adjustWavePhase(waveType, phase) {
        if (this.waves[waveType]) {
            this.waves[waveType].phase = phase;
        }
    }
}

// Initialize Multi-Wave Visualization System
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🌊 Initializing Multi-Wave Visualization System...');
        window.multiWaveSystem = new MultiWaveVisualization();
        console.log('✅ Multi-Wave System ready!');
    }, 3000);
});
