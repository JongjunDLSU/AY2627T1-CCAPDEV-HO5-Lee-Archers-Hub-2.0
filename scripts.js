
const GREEN = '#087f35';
const GREEN_2 = '#77a88d';
const GREEN_3 = '#b7cbbd';
const GREEN_4 = '#d6dfd9';
const GREEN_PALETTE = [GREEN, GREEN_2, GREEN_3, GREEN_4];
const FILL_PALETTE = [
    'rgba(8, 127, 53, 0.13)',
    'rgba(119, 168, 141, 0.16)',
    'rgba(183, 203, 189, 0.25)',
    'rgba(214, 223, 217, 0.48)'
];
const GRID = 'rgba(60, 70, 65, 0.14)';
const TEXT = '#5b6064';

Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
Chart.defaults.color = TEXT;

const academicYear = 'AY2026~2027';
const semesterTerms = ['Term 1', 'Term 2', 'Term 3'];
const semesterTickLabels = semesterTerms;
const gradeAxis = {
    min: 0,
    max: 4,
    title: { display: true, text: 'GPA' },
    ticks: {
        stepSize: 0.5,
        callback: (value) => Number(value) === 0 ? '0' : Number(value).toFixed(1)
    },
    grid: { color: GRID }
};

function getMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2
        ? sorted[middle]
        : (sorted[middle - 1] + sorted[middle]) / 2;
}

function getGradeSummary(values) {
    const sorted = [...values].sort((a, b) => a - b);
    return {
        min: sorted[0],
        median: getMedian(sorted),
        mean: sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
        max: sorted[sorted.length - 1]
    };
}

function formatGpa(value) {
    return Number(value).toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
}

const selectedCourse = 'CCADVDB';
const selectedSemester = `${academicYear} Term 3`;
const studentGpasForCourse = [
    1.4, 1.7, 1.9, 2.0, 2.1, 2.2, 2.2, 2.4, 2.5, 2.5, 2.6,
    2.7, 2.8, 2.9, 3.0, 3.0, 3.1, 3.2, 3.4, 3.6, 3.8
];
const courseSummary = getGradeSummary(studentGpasForCourse);

document.getElementById('gradeMin').textContent = formatGpa(courseSummary.min);
document.getElementById('gradeMedian').textContent = formatGpa(courseSummary.median);
document.getElementById('gradeMean').textContent = formatGpa(courseSummary.mean);
document.getElementById('gradeMax').textContent = formatGpa(courseSummary.max);

new Chart(document.getElementById('gradeDistributionChart'), {
    type: 'boxplot',
    data: {
        labels: [`${selectedCourse} · ${selectedSemester}`],
        datasets: [{
            label: 'Student GPA',
            data: [studentGpasForCourse],
            backgroundColor: 'rgba(8, 127, 53, 0.16)',
            borderColor: GREEN,
            borderWidth: 2,
            medianColor: GREEN,
            medianWidth: 3,
            coef: 0,
            meanStyle: 'circle',
            meanRadius: 5,
            meanBackgroundColor: '#ffffff',
            meanBorderColor: GREEN,
            meanBorderWidth: 2,
            outlierRadius: 3,
            outlierBackgroundColor: GREEN_2,
            itemRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
            x: { ...gradeAxis, title: { display: true, text: 'GPA (0–4)' } },
            y: { grid: { display: false }, ticks: { display: false, padding: 0 } }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: () => `${selectedCourse} · ${selectedSemester}`,
                    label: () => `Student GPA distribution (n = ${studentGpasForCourse.length})`,
                    afterBody: () => [
                        `Minimum: ${formatGpa(courseSummary.min)}`,
                        `Median: ${formatGpa(courseSummary.median)}`,
                        `Mean: ${formatGpa(courseSummary.mean)}`,
                        `Maximum: ${formatGpa(courseSummary.max)}`
                    ]
                }
            }
        }
    }
});

const professors = [
    { name: 'Prof. Santos', color: GREEN, fill: FILL_PALETTE[0], values: [3.0, 3.2, 3.4, 3.3, 3.6] },
    { name: 'Prof. Reyes', color: GREEN_2, fill: FILL_PALETTE[1], values: [2.8, 3.0, 3.1, 3.3, 3.4] },
    { name: 'Prof. Cruz', color: '#6d967e', fill: FILL_PALETTE[2], values: [3.3, 3.1, 3.5, 3.4, 3.7] },
    { name: 'Prof. Lim', color: '#a4b9aa', fill: FILL_PALETTE[3], values: [2.6, 2.7, 2.9, 3.0, 3.2] }
];

const streamChart = new Chart(document.getElementById('professorStreamChart'), {
    type: 'line',
    data: {
        labels: semesterTickLabels,
        datasets: professors.map((professor, index) => ({
            label: professor.name,
            data: professor.values,
            borderColor: professor.color,
            backgroundColor: professor.fill,
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: professor.color,
            pointBorderWidth: 2,
            tension: 0.38,
            fill: 'origin',
            order: professors.length - index
        }))
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: false },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Semester' },
                ticks: { autoSkip: false, maxRotation: 0, minRotation: 0, font: { size: 11 } }
            },
            y: { ...gradeAxis, title: { display: true, text: 'Average GPA (0–4)' } }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title: (items) => items.length ? `${academicYear} ${semesterTerms[items[0].dataIndex]}` : '',
                    label: (item) => `${item.dataset.label}: ${Number(item.raw).toFixed(1)} GPA average`
                }
            }
        }
    }
});

const professorLegend = document.getElementById('professorLegend');
professors.forEach((professor) => {
    const item = document.createElement('span');
    item.className = 'legend-item';
    const swatch = document.createElement('span');
    swatch.className = 'legend-dot';
    swatch.style.backgroundColor = professor.color;
    const label = document.createElement('span');
    label.textContent = professor.name.replace('Prof. ', '');
    item.append(swatch, label);
    professorLegend.appendChild(item);
});

const ids = ['ID 122', 'ID 123', 'ID 124'];
const courses = ['Programming', 'Database', 'Networking', 'Web Dev.'];

const studentCounts = [
    [34, 28, 18],
    [26, 22, 12],
    [18, 21, 17],
    [32, 25, 15]
];

const totalStudents = studentCounts.reduce(
    (grandTotal, courseCounts) => grandTotal + courseCounts.reduce((sum, count) => sum + count, 0),
    0
);

function overallPercentage(value) {
    return totalStudents === 0 ? 0 : (value / totalStudents) * 100;
}

function getIdGroupedDatasets() {
    return courses.map((course, courseIndex) => ({
        label: course,
        data: ids.map((_, idIndex) => overallPercentage(studentCounts[courseIndex][idIndex])),
        backgroundColor: GREEN_PALETTE[courseIndex],
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 1
    }));
}

function getCourseGroupedDatasets() {
    return ids.map((id, idIndex) => ({
        label: id,
        data: courses.map((_, courseIndex) => overallPercentage(studentCounts[courseIndex][idIndex])),
        backgroundColor: GREEN_PALETTE[idIndex],
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 1
    }));
}

function getStackedAxisMax(datasets) {
    const barCount = datasets.reduce((max, dataset) => Math.max(max, dataset.data.length), 0);
    let tallestBar = 0;
    for (let index = 0; index < barCount; index += 1) {
        const totalForBar = datasets.reduce((sum, dataset) => sum + Number(dataset.data[index] || 0), 0);
        tallestBar = Math.max(tallestBar, totalForBar);
    }
    return Math.max(10, Math.ceil((tallestBar - 1e-9) / 10) * 10);
}

function drawStackedLegend(datasets) {
    const legend = document.getElementById('stackedLegend');
    legend.replaceChildren();
    datasets.forEach((dataset) => {
        const item = document.createElement('span');
        item.className = 'legend-item';
        const swatch = document.createElement('span');
        swatch.className = 'legend-dot';
        swatch.style.backgroundColor = dataset.backgroundColor;
        const label = document.createElement('span');
        label.textContent = dataset.label;
        item.append(swatch, label);
        legend.appendChild(item);
    });
}

const stackedCtx = document.getElementById('courseShareChart');
const idButton = document.getElementById('idButton');
const courseButton = document.getElementById('courseButton');
let isIdMode = true;
const modeDescription = document.getElementById('stackedModeDescription');

function getStackedView(isIdMode) {
    return {
        labels: isIdMode ? ids : courses,
        datasets: isIdMode ? getIdGroupedDatasets() : getCourseGroupedDatasets()
    };
}

const initialStackedData = getStackedView(isIdMode);
const stackedChart = new Chart(stackedCtx, {
    type: 'bar',
    data: initialStackedData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: { maxRotation: 30, minRotation: 0 }
            },
            y: {
                stacked: true,
                min: 0,
                max: getStackedAxisMax(initialStackedData.datasets),
                title: { display: true, text: 'Share of all students (%)' },
                ticks: { stepSize: 10, callback: (value) => `${value}%` },
                grid: { color: GRID }
            }
        },
        datasets: {
            bar: { barPercentage: 0.72, categoryPercentage: 0.78 }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                label: (item) => `${item.dataset.label}: ${Number(item.raw).toFixed(1)}% of all students`,
                afterLabel: (item) => isIdMode
                    ? `of students in ${ids[item.dataIndex]}`
                    : `of students in ${courses[item.dataIndex]}`
                }
            }
        }
    }
});

drawStackedLegend(initialStackedData.datasets);

function updateStackedMode(nextIsIdMode) {
    isIdMode = nextIsIdMode;
    const nextData = getStackedView(isIdMode);
    stackedChart.data.labels = nextData.labels;
    stackedChart.data.datasets = nextData.datasets;
    stackedChart.options.scales.y.max = getStackedAxisMax(nextData.datasets);
    stackedChart.update();
    drawStackedLegend(nextData.datasets);

    idButton.classList.toggle('active', isIdMode);
    courseButton.classList.toggle('active', !isIdMode);
    modeDescription.textContent = isIdMode
        ? 'Each ID bar is segmented by Course.'
        : 'Each Course bar is segmented by ID.';
}

idButton.addEventListener('click', () => updateStackedMode(true));
courseButton.addEventListener('click', () => updateStackedMode(false));

