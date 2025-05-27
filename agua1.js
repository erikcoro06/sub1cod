        function formatNumber(n) {
            return Number(n).toLocaleString('es-MX', {maximumFractionDigits: 1});
        }

        function resetForm() {
            document.getElementById('budget-form').reset();
            document.getElementById('results').style.display = 'none';
            document.getElementById('materials-list').innerHTML = '';
        }

        function calculateBudget() {
            const roofArea = parseFloat(document.getElementById('roof-area').value);
            const rainfall = parseFloat(document.getElementById('rainfall').value);
            const storageDays = parseInt(document.getElementById('storage-days').value);
            const systemType = document.getElementById('system-type').value;

            if (isNaN(roofArea) || isNaN(rainfall) || isNaN(storageDays) ||
                roofArea <= 0 || rainfall <= 0 || storageDays <= 0) {
                alert("Por favor complete todos los campos con valores válidos.");
                return;
            }

            
            const dailyCapture = roofArea * rainfall * 0.9;
            const storageNeeded = dailyCapture * storageDays;

            let materials = [];
            materials.push({
                name: "Canaletas de PVC",
                quantity: Math.ceil(roofArea / 10),
                unit: "metros",
                unitCost: 5,
                description: "Canaletas para recolectar agua del techo"
            });
            materials.push({
                name: "Filtro de hojas y sedimentos",
                quantity: 1,
                unit: "unidad",
                unitCost: 80,
                description: "Filtro para remover hojas y partículas grandes"
            });
            
            materials.push({
                name: "Tubería de conducción",
                quantity: Math.ceil(roofArea / 20) * 3,
                unit: "metros",
                unitCost: 3,
                description: "Tubería para llevar agua al tanque de almacenamiento"
            });
            const tankSize = storageNeeded < 1000 ? 1000 :
                            storageNeeded < 5000 ? 5000 :
                            storageNeeded < 10000 ? 10000 : 20000;
            materials.push({
                name: "Tanque de almacenamiento",
                quantity: 1,
                unit: `${tankSize} litros`,
                unitCost: tankSize * 0.8,
                description: `Tanque para almacenar hasta ${tankSize} litros de agua`
            });
            if (systemType !== "basic") {
                materials.push({
                    name: "Bomba eléctrica",
                    quantity: 1,
                    unit: "unidad",
                    unitCost: 150,
                    description: "Bomba para distribución del agua"
                });
                materials.push({
                    name: "Sistema de distribución",
                    quantity: Math.ceil(roofArea / 10),
                    unit: "metros",
                    unitCost: 4,
                    description: "Tuberías para distribución del agua"
                });
                if (systemType === "complete") {
                    materials.push({
                        name: "Sistema de tratamiento",
                        quantity: 1,
                        unit: "unidad",
                        unitCost: 300,
                        description: "Filtros y desinfección para agua potable"
                    });
                    materials.push({
                        name: "Controlador automático",
                        quantity: 1,
                        unit: "unidad",
                        unitCost: 200,
                        description: "Sistema de monitoreo y control automático"
                    });
                }
            }
            const totalCost = materials.reduce((sum, m) => sum + (m.quantity * m.unitCost), 0);

            document.getElementById('daily-capture').textContent = formatNumber(dailyCapture);
            document.getElementById('storage-needed').textContent = formatNumber(storageNeeded);
            document.getElementById('total-budget').textContent = formatNumber(totalCost.toFixed(2));

            const materialsList = document.getElementById('materials-list');
            materialsList.innerHTML = '<h4>Materiales requeridos:</h4>';
            materials.forEach(material => {
                const materialCost = material.quantity * material.unitCost;
                const materialDiv = document.createElement('div');
                materialDiv.className = 'material-item';
                materialDiv.innerHTML = `
                    <div class="material-title">
                        ${material.name} (${material.quantity} ${material.unit} @ $${formatNumber(material.unitCost)}/${material.unit.split(' ')[0]})
                        <span class="tooltip info-icon">ℹ️
                            <span class="tooltiptext">${material.description}</span>
                        </span>
                    </div>
                    <div class="result-item" style="border-bottom:none;">
                        <span>Costo:</span>
                        <span>$${formatNumber(materialCost.toFixed(2))}</span>
                    </div>
                `;
                materialsList.appendChild(materialDiv);
            });

            document.getElementById('results').style.display = 'block';
            document.getElementById('results').scrollIntoView({behavior: "smooth"});
        }

        document.getElementById('budget-form').addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBudget();
        });
        document.getElementById('reset-btn').addEventListener('click', resetForm);

        ['roof-area', 'rainfall', 'storage-days', 'system-type'].forEach(id => {
            document.getElementById(id).addEventListener('input', function() {
                const area = document.getElementById('roof-area').value;
                const rain = document.getElementById('rainfall').value;
                const days = document.getElementById('storage-days').value;
                if (area && rain && days) {
                    calculateBudget();
                }
            });
        });