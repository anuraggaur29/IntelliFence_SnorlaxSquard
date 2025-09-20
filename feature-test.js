// IntelliFence Website Feature Test Script
// This script tests all major features to ensure they're working properly

console.log('🧪 Starting IntelliFence Feature Tests...');

// Test 1: Check if all main sections exist
function testSections() {
    const sections = [
        'home',
        'demo', 
        'features',
        'dashboard',
        'performance-analytics',
        'contact'
    ];
    
    console.log('📋 Testing Sections...');
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            console.log(`✅ Section '${sectionId}' found`);
        } else {
            console.error(`❌ Section '${sectionId}' missing`);
        }
    });
}

// Test 2: Check Real-Time Data Streaming
function testRealTimeStreaming() {
    console.log('📊 Testing Real-Time Data Streaming...');
    
    // Check if streaming charts exist
    const charts = ['voltageChart', 'currentChart', 'powerChart', 'healthChart'];
    charts.forEach(chartId => {
        const chart = document.getElementById(chartId);
        if (chart) {
            console.log(`✅ Chart '${chartId}' found`);
        } else {
            console.error(`❌ Chart '${chartId}' missing`);
        }
    });
    
    // Check if streaming controls exist
    const controls = ['pauseStream', 'resetCharts'];
    controls.forEach(controlId => {
        const control = document.getElementById(controlId);
        if (control) {
            console.log(`✅ Control '${controlId}' found`);
        } else {
            console.error(`❌ Control '${controlId}' missing`);
        }
    });
}

// Test 3: Check Interactive Map
function testInteractiveMap() {
    console.log('🗺️ Testing Interactive Map...');
    
    // Check if map elements exist
    const mapElements = ['kerala-state-map', 'showAllFences', 'focusAlerts', 'weatherOverlay'];
    mapElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`✅ Map element '${elementId}' found`);
        } else {
            console.log(`⚠️ Map element '${elementId}' not found (may be class-based)`);
        }
    });
    
    // Check for fence markers
    const fenceMarkers = document.querySelectorAll('.fence-marker');
    if (fenceMarkers.length > 0) {
        console.log(`✅ Found ${fenceMarkers.length} fence markers`);
    } else {
        console.error(`❌ No fence markers found`);
    }
}

// Test 4: Check AI Predictive Analytics
function testAIPredictiveAnalytics() {
    console.log('🤖 Testing AI Predictive Analytics...');
    
    // Check for AI elements
    const aiElements = document.querySelectorAll('.ai-prediction, .pattern-chart, .failure-prediction');
    if (aiElements.length > 0) {
        console.log(`✅ Found ${aiElements.length} AI analytics elements`);
    } else {
        console.log(`⚠️ AI analytics elements may be dynamically generated`);
    }
    
    // Check for predictive charts
    const patternChart = document.getElementById('patternChart');
    if (patternChart) {
        console.log(`✅ Pattern analysis chart found`);
    } else {
        console.log(`⚠️ Pattern chart may be canvas-based`);
    }
}

// Test 5: Check Alert Automation
function testAlertAutomation() {
    console.log('🚨 Testing Alert Automation...');
    
    // Check alert system elements
    const alertElements = ['alertList', 'globalAlertsPanel', 'globalCriticalCount', 'globalWarningCount'];
    alertElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`✅ Alert element '${elementId}' found`);
        } else {
            console.error(`❌ Alert element '${elementId}' missing`);
        }
    });
    
    // Check for alert automation controls
    const automationElements = document.querySelectorAll('.alert-automation, .automation-rule, .smart-response');
    if (automationElements.length > 0) {
        console.log(`✅ Found ${automationElements.length} alert automation elements`);
    }
}

// Test 6: Check Performance Analytics
function testPerformanceAnalytics() {
    console.log('📈 Testing Performance Analytics...');
    
    // Check for performance charts
    const performanceCharts = ['powerQualityChart', 'efficiencyChart', 'loadDistributionChart', 'faultAnalysisChart', 'comparisonChart'];
    performanceCharts.forEach(chartId => {
        const chart = document.getElementById(chartId);
        if (chart) {
            console.log(`✅ Performance chart '${chartId}' found`);
        } else {
            console.error(`❌ Performance chart '${chartId}' missing`);
        }
    });
    
    // Check for KPI cards
    const kpiCards = document.querySelectorAll('.kpi-card');
    if (kpiCards.length >= 4) {
        console.log(`✅ Found ${kpiCards.length} KPI cards`);
    } else {
        console.error(`❌ Expected 4 KPI cards, found ${kpiCards.length}`);
    }
    
    // Check for export functionality
    const exportBtn = document.querySelector('.analytics-btn.export');
    if (exportBtn) {
        console.log(`✅ Export functionality found`);
    } else {
        console.error(`❌ Export button missing`);
    }
}

// Test 7: Check Multi-Fence System
function testMultiFenceSystem() {
    console.log('🏗️ Testing Multi-Fence System...');
    
    // Check fence selector
    const fenceSelector = document.getElementById('fenceSelector');
    if (fenceSelector && fenceSelector.options.length > 1) {
        console.log(`✅ Fence selector found with ${fenceSelector.options.length} options`);
    } else {
        console.error(`❌ Fence selector missing or has no options`);
    }
    
    // Check fence data display
    const fenceElements = ['currentFenceName', 'currentFenceLocation', 'systemStatus'];
    fenceElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`✅ Fence display element '${elementId}' found`);
        } else {
            console.error(`❌ Fence display element '${elementId}' missing`);
        }
    });
}

// Test 8: Check Navigation and Links
function testNavigation() {
    console.log('🧭 Testing Navigation...');
    
    // Check main navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    if (navLinks.length > 0) {
        console.log(`✅ Found ${navLinks.length} navigation links`);
        
        // Test if target sections exist for each link
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    console.log(`✅ Navigation link '${href}' → target found`);
                } else {
                    console.error(`❌ Navigation link '${href}' → target missing`);
                }
            }
        });
    } else {
        console.error(`❌ No navigation links found`);
    }
}

// Test 9: Check JavaScript Functionality
function testJavaScriptFunctionality() {
    console.log('⚙️ Testing JavaScript Functionality...');
    
    // Check if main system classes exist
    const systemClasses = ['IntelliFenceSystem', 'RealTimeDataStreamer', 'GeographicalMapController', 'AIPredictiveAnalytics', 'SmartAlertAutomation', 'PerformanceAnalyticsSystem'];
    systemClasses.forEach(className => {
        if (window[className] || eval(`typeof ${className} !== 'undefined'`)) {
            console.log(`✅ Class '${className}' available`);
        } else {
            console.log(`⚠️ Class '${className}' may not be globally accessible`);
        }
    });
    
    // Check if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        console.log(`✅ Chart.js library loaded`);
    } else {
        console.error(`❌ Chart.js library missing`);
    }
}

// Test 10: Check Responsive Design Elements
function testResponsiveDesign() {
    console.log('📱 Testing Responsive Design Elements...');
    
    // Check for responsive classes
    const responsiveElements = document.querySelectorAll('.container, .grid, .flex, .responsive');
    if (responsiveElements.length > 0) {
        console.log(`✅ Found ${responsiveElements.length} responsive design elements`);
    }
    
    // Check viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        console.log(`✅ Viewport meta tag found: ${viewportMeta.getAttribute('content')}`);
    } else {
        console.error(`❌ Viewport meta tag missing`);
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 IntelliFence Feature Test Suite Starting...\n');
    
    try {
        testSections();
        console.log('');
        
        testRealTimeStreaming();
        console.log('');
        
        testInteractiveMap();
        console.log('');
        
        testAIPredictiveAnalytics();
        console.log('');
        
        testAlertAutomation();
        console.log('');
        
        testPerformanceAnalytics();
        console.log('');
        
        testMultiFenceSystem();
        console.log('');
        
        testNavigation();
        console.log('');
        
        testJavaScriptFunctionality();
        console.log('');
        
        testResponsiveDesign();
        console.log('');
        
        console.log('✅ All tests completed! Check the results above for any issues.');
        console.log('🎉 IntelliFence website feature testing complete!');
        
    } catch (error) {
        console.error('❌ Error during testing:', error);
    }
}

// Auto-run tests when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}

// Export for manual testing
window.IntelliFenceTests = {
    runAllTests,
    testSections,
    testRealTimeStreaming,
    testInteractiveMap,
    testAIPredictiveAnalytics,
    testAlertAutomation,
    testPerformanceAnalytics,
    testMultiFenceSystem,
    testNavigation,
    testJavaScriptFunctionality,
    testResponsiveDesign
};