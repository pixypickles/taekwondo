extends Node2D

@onready var blue := $PlayerBlue
@onready var red := $PlayerRed

func _ready() -> void:
	blue.opponent = red
	red.opponent = blue

func _draw() -> void:
	# Background: simple outdoor dojang / mat.
	draw_rect(Rect2(Vector2.ZERO, Vector2(1280, 720)), Color(0.38, 0.72, 1.0))
	draw_circle(Vector2(230, 320), 190, Color(0.23, 0.55, 0.32))
	draw_circle(Vector2(1040, 320), 210, Color(0.20, 0.48, 0.30))
	draw_rect(Rect2(0, 335, 1280, 55), Color(0.55, 0.42, 0.30))
	for x in range(0, 1280, 80):
		draw_line(Vector2(x, 335), Vector2(x, 390), Color(0.35, 0.26, 0.18), 4)
	draw_line(Vector2(0, 355), Vector2(1280, 355), Color(0.72, 0.62, 0.48), 6)
	draw_line(Vector2(0, 380), Vector2(1280, 380), Color(0.72, 0.62, 0.48), 6)
	draw_rect(Rect2(0, 390, 1280, 330), Color(0.06, 0.22, 0.58))
	draw_rect(Rect2(0, 390, 1280, 38), Color(0.73, 0.16, 0.18))
	draw_rect(Rect2(80, 430, 1120, 250), Color(0.08, 0.30, 0.72))
	# Mat grid
	for x in range(80, 1201, 40):
		draw_line(Vector2(x, 430), Vector2(x, 680), Color(1, 1, 1, 0.05), 1)
	for y in range(430, 681, 40):
		draw_line(Vector2(80, y), Vector2(1200, y), Color(1, 1, 1, 0.05), 1)
	_draw_hud()
	_draw_controls()

func _process(_delta: float) -> void:
	queue_redraw()

func _draw_hud() -> void:
	_draw_bar(Vector2(30, 35), 420, 24, blue.health / 1000.0, Color(0.2, 0.9, 0.1), "PLAYER  " + str(int(blue.health)) + " / 1000")
	_draw_bar(Vector2(30, 72), 420, 16, blue.balance / 100.0, Color(0.1, 0.45, 1.0), "BALANCE")
	_draw_bar(Vector2(830, 35), 420, 24, red.health / 1000.0, Color(0.2, 0.9, 0.1), "CPU  " + str(int(red.health)) + " / 1000")
	_draw_bar(Vector2(830, 72), 420, 16, red.balance / 100.0, Color(0.1, 0.45, 1.0), "BALANCE")
	draw_rect(Rect2(590, 22, 100, 78), Color(0.05, 0.07, 0.10, 0.9))
	draw_string(ThemeDB.fallback_font, Vector2(611, 52), "ROUND 1", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color.WHITE)
	draw_string(ThemeDB.fallback_font, Vector2(625, 90), "60", HORIZONTAL_ALIGNMENT_LEFT, -1, 42, Color.WHITE)

func _draw_bar(pos: Vector2, w: float, h: float, ratio: float, color: Color, label: String) -> void:
	draw_rect(Rect2(pos, Vector2(w, h)), Color(0.05, 0.06, 0.08))
	draw_rect(Rect2(pos + Vector2(2, 2), Vector2((w - 4) * clamp(ratio, 0, 1), h - 4)), color)
	draw_string(ThemeDB.fallback_font, pos + Vector2(10, h - 5), label, HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color.WHITE)

func _draw_controls() -> void:
	# On-screen guide only. For PC test: arrows, Z, X, C.
	draw_rect(Rect2(30, 120, 320, 165), Color(0.02, 0.02, 0.02, 0.65))
	var text := "操作\n←/→: 移動　前前: ステップイン\n後後: バックステップ\n↓: 回転フェイント\nZ: 小キック　X: 大キック\nC: ガード\n回転中+Z: ティッチャギ（後ろ蹴り）\n回転中+X: ティフリギ（後ろ回し蹴り）"
	var y := 150
	for line in text.split("\n"):
		draw_string(ThemeDB.fallback_font, Vector2(48, y), line, HORIZONTAL_ALIGNMENT_LEFT, -1, 17, Color.WHITE)
		y += 20
