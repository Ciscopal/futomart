var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

var allListings = []
var selectedCategory = 'all'
var selectedCondition = 'all'

// Check if category is passed from homepage
var urlParams = new URLSearchParams(window.location.search)
var categoryParam = urlParams.get('category')
if (categoryParam) {
    selectedCategory = categoryParam
}

async function loadListings() {
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error loading listings:', error)
        return
    }

    allListings = data
    filterListings()
}

function displayListings(listings) {
    const grid = document.getElementById('listings-grid')
    const count = document.getElementById('results-count')
    count.textContent = listings.length + ' items found'
    grid.innerHTML = ''

    if (listings.length === 0) {
        grid.innerHTML = '<p style="color:#888;font-size:15px;">No items found for this category.</p>'
        return
    }

    listings.forEach(function (item) {
        const image = item.image_url ? item.image_url : 'https://placehold.co/300x180?text=No+Image'
        const soldBadge = item.sold ? '<div style="background:#856404;color:white;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block;margin-top:4px;">SOLD</div>' : ''
        const opacity = item.sold ? 'opacity:0.6;' : ''
        grid.innerHTML += '<div class="listing-card" style="' + opacity + '" onclick="window.location.href=\'item.html?id=' + item.id + '\'">' +
            '<img src="' + image + '" alt="' + item.title + '">' +
            '<div class="listing-info">' +
            '<h3>' + item.title + '</h3>' +
            '<div class="price">NGN ' + Number(item.price).toLocaleString() + '</div>' +
            '<div class="condition">' + item.condition + '</div>' +
            soldBadge +
            '</div></div>'
    })
}

function filterListings() {
    const maxPrice = document.getElementById('price-filter').value
    const search = document.getElementById('search-input').value.toLowerCase()

    const filtered = allListings.filter(function (item) {
        const matchCategory = selectedCategory === 'all' || item.category === selectedCategory
        const matchCondition = selectedCondition === 'all' || item.condition === selectedCondition
        const matchPrice = maxPrice === '' || item.price <= parseInt(maxPrice)
        const matchSearch = item.title.toLowerCase().includes(search)
        return matchCategory && matchCondition && matchPrice && matchSearch
    })

    displayListings(filtered)
}

function toggleFilters() {
    document.getElementById('filters-sidebar').classList.toggle('open')
}

function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('open')
}

function setupDropdown(selectId, onSelect) {
    const container = document.getElementById(selectId)
    const selected = container.querySelector('.select-selected')
    const items = container.querySelector('.select-items')

    selected.addEventListener('click', function (e) {
        e.stopPropagation()
        document.querySelectorAll('.select-items').forEach(function (el) {
            if (el !== items) el.classList.add('select-hide')
        })
        document.querySelectorAll('.select-selected').forEach(function (el) {
            if (el !== selected) el.classList.remove('open')
        })
        items.classList.toggle('select-hide')
        selected.classList.toggle('open')
    })

    items.querySelectorAll('div').forEach(function (option) {
        option.addEventListener('click', function () {
            selected.textContent = this.textContent
            selected.classList.remove('open')
            items.classList.add('select-hide')
            items.querySelectorAll('div').forEach(function (el) {
                el.classList.remove('selected')
            })
            this.classList.add('selected')
            onSelect(this.getAttribute('data-value'))
            filterListings()
        })
    })
}

async function checkAuth() {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
        document.getElementById('nav-links').innerHTML =
            '<a href="index.html">Home</a>' +
            '<a href="listings.html">Browse</a>' +
            '<a href="post.html">Sell Item</a>' +
            '<a href="dashboard.html">My Listings</a>' +
            '<span style="margin-left:20px;font-weight:600;color:#008000;font-size:14px;">' + data.user.email + '</span>' +
            '<a href="#" onclick="handleLogout()" class="btn-signup" style="margin-left:10px;">Logout</a>'
    }
}

async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = 'index.html'
}

document.addEventListener('click', function () {
    document.querySelectorAll('.select-items').forEach(function (el) {
        el.classList.add('select-hide')
    })
    document.querySelectorAll('.select-selected').forEach(function (el) {
        el.classList.remove('open')
    })
})

document.getElementById('search-input').addEventListener('input', filterListings)

setupDropdown('category-select', function (val) { selectedCategory = val })
setupDropdown('condition-select', function (val) { selectedCondition = val })

checkAuth()
loadListings()