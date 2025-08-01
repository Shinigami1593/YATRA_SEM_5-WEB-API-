/**
 * @vitest-environment jsdom
 */
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import HomePage from '@/views/Home.vue'

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Stub MapView
vi.mock('@/components/MapView.vue', () => ({
  default: {
    name: 'MapView',
    props: ['routes', 'markers', 'zoomLevel', 'center'],
    template: '<div data-test="map-view">mapview</div>',
  },
}))

// Mock API response
vi.mock('@/services/axios.js', () => ({
  userApiClient: {
    get: vi.fn().mockResolvedValue({
      data: {
        routes: [
          {
            id: 'r1',
            properties: {
              source: 'Kathmandu',
              destination: 'Pokhara',
              status: 'active',
              type: 'bus',
            },
            distance: 200,
            estimatedDuration: '5h',
            trips: [
              { vehicleType: 'bus' },
              { vehicleType: 'micro' },
              { vehicleType: 'bus' },
            ],
            coordinates: [[[85.324, 27.7172], [83.9856, 28.2096]]],
            sourceCoordinates: [85.324, 27.7172],
            destinationCoordinates: [83.9856, 28.2096],
          },
          {
            id: 'r2',
            properties: {
              source: 'Biratnagar',
              destination: 'Janakpur',
              status: 'maintenance',
              type: 'tempo',
            },
            distance: 150,
            estimatedDuration: '3h 30m',
            trips: [{ vehicleType: 'tempo' }],
            coordinates: [[[87.2718, 26.4525], [85.9210, 26.7190]]],
            sourceCoordinates: [87.2718, 26.4525],
            destinationCoordinates: [85.9210, 26.7190],
          },
        ],
      },
    }),
  },
}))

describe('HomePage.vue', () => {
  let wrapper

  beforeEach(async () => {
    mockPush.mockClear()
    wrapper = mount(HomePage, {
      global: {
        stubs: ['router-link'],
      },
    })
    await flushPromises()
  })

  it('renders hero title and subtitle', () => {
    expect(wrapper.find('.hero-title').text()).toBe("Explore Nepal's Travel Routes")
    expect(wrapper.find('.hero-subtitle').text()).toContain('Discover available transportation routes across Nepal.')
  })

  it('has hero buttons and triggers navigation', async () => {
    const browseBtn = wrapper.find('button.cta-btn.primary')
    const mapBtn = wrapper.find('button.cta-btn.secondary')

    expect(browseBtn.exists()).toBe(true)
    expect(mapBtn.exists()).toBe(true)

    await browseBtn.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/user/all-routes')

    await mapBtn.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/details-map')
  })

  it('shows map placeholder before mapLoaded is true', () => {
    expect(wrapper.find('.map-placeholder').exists()).toBe(true)
    expect(wrapper.find('[data-test="map-view"]').exists()).toBe(false)
  })

  it('shows MapView when mapLoaded is true', async () => {
    wrapper.vm.mapLoaded = true
    await nextTick()
    expect(wrapper.find('[data-test="map-view"]').exists()).toBe(true)
  })

  it('computes and renders stats correctly', () => {
    const vm = wrapper.vm
    expect(vm.totalRoutes).toBe(2)
    expect(vm.totalCities).toBe(4)
    expect(vm.vehicleTypes).toBe(2)
    expect(vm.totalTrips).toBe(0)

    const statNumbers = wrapper.findAll('.stat-number').map(n => n.text())
    expect(statNumbers).toContain('2')
    expect(statNumbers).toContain('4')
    expect(statNumbers).toContain('0')
  })

  it('renders route cards with source and destination', () => {
    const cards = wrapper.findAll('.route-card')
    expect(cards.length).toBe(2)
    expect(cards[0].text()).toContain('Kathmandu')
    expect(cards[0].text()).toContain('Pokhara')
    expect(cards[1].text()).toContain('Biratnagar')
    expect(cards[1].text()).toContain('Janakpur')
  })

  it('renders correct status badge and class', () => {
    const badges = wrapper.findAll('.status-badge')
    expect(badges[0].text().toLowerCase()).toContain('active')
    expect(badges[0].classes()).toContain('active')

    expect(badges[1].text().toLowerCase()).toContain('maintenance')
    expect(badges[1].classes()).toContain('maintenance')
  })

  it('displays unique vehicle badges', () => {
    const badges = wrapper.findAll('.route-card')[0].findAll('.vehicle-badge').map(w => w.text().toLowerCase())
    expect(badges).toEqual(expect.arrayContaining(['bus', 'micro']))
  })

  it('navigates to route map when clicking "View on Map"', async () => {
    const viewMapBtn = wrapper.findAll('.route-card')[0].find('button.action-btn')
    await viewMapBtn.trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/routes-map?route=r1')
  })

  it('quick access cards trigger navigation', async () => {
    const cards = wrapper.findAll('.access-card')
    await cards[0].trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/user/all-routes')

    await cards[1].trigger('click')
    expect(mockPush).toHaveBeenCalledWith('/details-map')
  })
})
