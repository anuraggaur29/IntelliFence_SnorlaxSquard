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
