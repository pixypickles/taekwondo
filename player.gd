extends Node2D

@export var fighter_color: Color = Color.BLUE
@export var facing: int = 1
@export var is_player: bool = true

var opponent: Node2D
var health := 1000.0
var balance := 100.0

var state := "idle"
var state_time := 0.0
var attack_active := false
var attack_name := ""
var attack_damage := 0.0
var attack_balance := 0.0
var hit_once := false

var last_forward_tap := -10.0
var last_back_tap := -10.0
var tap_window := 0.28
var step_velocity := 0.0

const MOVE_SPEED := 210.0
const STEP_DISTANCE := 92.0
const STEP_TIME := 0.16
const BACKSTEP_DISTANCE := 112.0
const BACKSTEP_TIME := 0.18

func _process(delta: float) -> void:
	state_time += delta
	if is_player:
		_handle_player_input(delta)
	else:
		_handle_dummy_ai(delta)
	_update_state(delta)
	_try_hit()
	queue_redraw()

func _handle_player_input(delta: float) -> void:
	if _is_busy_for_input():
		return
	var dir := Input.get_axis("move_left", "move_right")
	if dir != 0:
		position.x += dir * MOVE_SPEED * delta
		state = "walk"
		state_time = 0.0
	else:
		if state == "walk": _set_state("idle")

	if Input.is_action_just_pressed("move_right"):
		_check_step_tap(1)
	if Input.is_action_just_pressed("move_left"):
		_check_step_tap(-1)
	if Input.is_action_just_pressed("rotate_feint"):
		_start_rotate()
	if Input.is_action_pressed("guard"):
		_set_state("guard")
	elif state == "guard":
		_set_state("idle")

	if Input.is_action_just_pressed("small_kick"):
		_choose_kick(false)
	if Input.is_action_just_pressed("big_kick"):
		_choose_kick(true)

func _handle_dummy_ai(delta: float) -> void:
	# Simple standing opponent. Later this can become real AI.
	if state == "idle":
		var dist := abs(position.x - opponent.position.x) if opponent else 999
		if dist < 150:
			_start_attack("大キック", 90, 13, 0.50, 0.18, 92)
		else:
			position.x += facing * MOVE_SPEED * 0.35 * delta
			state = "walk"
			state_time = 0.0

func _check_step_tap(input_dir: int) -> void:
	# Forward/back is based on fighter facing.
	var now := Time.get_ticks_msec() / 1000.0
	if input_dir == facing:
		if now - last_forward_tap <= tap_window:
			_start_step(true)
		last_forward_tap = now
	else:
		if now - last_back_tap <= tap_window:
			_start_step(false)
		last_back_tap = now

func _start_step(forward: bool) -> void:
	if forward:
		step_velocity = facing * STEP_DISTANCE / STEP_TIME
		_set_state("step_in")
	else:
		step_velocity = -facing * BACKSTEP_DISTANCE / BACKSTEP_TIME
		_set_state("backstep")

func _start_rotate() -> void:
	_set_state("rotate")

func _choose_kick(big: bool) -> void:
	var up := Input.is_action_pressed("move_up")
	var back := Input.is_action_pressed("move_left") if facing == 1 else Input.is_action_pressed("move_right")
	var forward := Input.is_action_pressed("move_right") if facing == 1 else Input.is_action_pressed("move_left")
	if state == "rotate":
		if big:
			_start_attack("ティフリギ（後ろ回し蹴り）", 150, 24, 0.72, 0.28, 125)
		else:
			_start_attack("ティッチャギ（後ろ蹴り）", 120, 20, 0.58, 0.20, 110)
		return
	if up and big:
		_start_attack("跳び後ろ回し蹴り", 170, 28, 0.82, 0.34, 122)
	elif up:
		_start_attack("ネリョチャギ", 100, 18, 0.56, 0.20, 98)
	elif back and big:
		position.x -= facing * 30
		_start_attack("下がり跳びティッチャギ", 135, 22, 0.68, 0.25, 112)
	elif back:
		position.x -= facing * 25
		_start_attack("下がりトルリョチャギ", 80, 14, 0.50, 0.17, 96)
	elif forward and big:
		position.x += facing * 30
		_start_attack("前進大キック", 105, 17, 0.54, 0.19, 112)
	elif forward:
		position.x += facing * 20
		_start_attack("前進小キック", 65, 10, 0.40, 0.13, 104)
	elif big:
		_start_attack("大キック", 90, 13, 0.50, 0.18, 92)
	else:
		_start_attack("小キック", 55, 8, 0.34, 0.10, 82)

func _start_attack(name: String, dmg: float, bal: float, duration: float, active_at: float, _range: float) -> void:
	attack_name = name
	attack_damage = dmg
	attack_balance = bal
	attack_active = false
	hit_once = false
	_set_state("attack")
	# Pack timing/range in metadata variables.
	set_meta("duration", duration)
	set_meta("active_at", active_at)
	set_meta("range", _range)

func _set_state(next: String) -> void:
	state = next
	state_time = 0.0

func _is_busy_for_input() -> bool:
	return state in ["attack", "step_in", "backstep", "hit"]

func _update_state(delta: float) -> void:
	position.x = clamp(position.x, 120, 1160)
	if state == "step_in" and state_time < STEP_TIME:
		position.x += step_velocity * delta
	elif state == "step_in":
		_set_state("idle")
	if state == "backstep" and state_time < BACKSTEP_TIME:
		position.x += step_velocity * delta
	elif state == "backstep":
		_set_state("idle")
	if state == "rotate" and state_time > 0.42:
		_set_state("idle")
	if state == "attack":
		var duration: float = get_meta("duration", 0.4)
		var active_at: float = get_meta("active_at", 0.15)
		attack_active = state_time >= active_at and state_time <= active_at + 0.12
		if state_time > duration:
			balance = max(0, balance - (attack_balance * 0.25 if not hit_once else 0))
			_set_state("idle")
	if state == "hit" and state_time > 0.25:
		_set_state("idle")

func _try_hit() -> void:
	if not attack_active or hit_once or opponent == null:
		return
	var reach: float = get_meta("range", 90.0)
	if abs(opponent.position.x - position.x) <= reach:
		hit_once = true
		var guarded := opponent.state == "guard"
		if guarded:
			opponent.health = max(0, opponent.health - attack_damage * 0.18)
			opponent.balance = max(0, opponent.balance - attack_balance * 0.80)
		else:
			opponent.health = max(0, opponent.health - attack_damage)
			opponent.balance = max(0, opponent.balance - attack_balance)
			opponent._set_state("hit")

func _draw() -> void:
	var flip := facing
	var body := fighter_color
	var skin := Color(1.0, 0.78, 0.58)
	var black := Color(0.03, 0.03, 0.04)
	# Shadow
	draw_ellipse(Rect2(Vector2(-42, 87), Vector2(84, 16)), Color(0,0,0,0.22))
	# Legs
	var kick_pose := state == "attack"
	var rotate_pose := state == "rotate" or (state == "attack" and attack_name.find("ティ") >= 0)
	if kick_pose:
		draw_line(Vector2(0, 42), Vector2(-22 * flip, 88), body, 17)
		draw_line(Vector2(4, 40), Vector2(70 * flip, 18), body, 16)
		draw_circle(Vector2(80 * flip, 15), 8, skin)
	else:
		draw_line(Vector2(-12, 42), Vector2(-24, 88), body, 17)
		draw_line(Vector2(12, 42), Vector2(25, 88), body, 17)
		draw_circle(Vector2(-24, 92), 8, skin)
		draw_circle(Vector2(25, 92), 8, skin)
	# Body
	draw_polygon(PackedVector2Array([Vector2(-28, -12), Vector2(28, -12), Vector2(22, 48), Vector2(-22, 48)]), PackedColorArray([body, body, body, body]))
	draw_line(Vector2(-26, 44), Vector2(26, 44), black, 6)
	draw_line(Vector2(0, -10), Vector2(0, 45), Color(1,1,1,0.28), 3)
	# Arms / guard pose
	if state == "guard":
		draw_line(Vector2(-18, 0), Vector2(8 * flip, 20), body, 12)
		draw_line(Vector2(18, 0), Vector2(15 * flip, 22), body, 12)
		draw_circle(Vector2(18 * flip, 23), 8, skin)
	else:
		draw_line(Vector2(-22, -2), Vector2(-42 * flip, 20), body, 11)
		draw_line(Vector2(22, -2), Vector2(43 * flip, 16), body, 11)
		draw_circle(Vector2(45 * flip, 15), 8, skin)
	# Head and eyes
	draw_circle(Vector2(0, -42), 25, skin)
	draw_arc(Vector2(0, -48), 26, PI, TAU, 18, black, 10)
	draw_circle(Vector2(8 * flip, -45), 3.2, black)
	draw_line(Vector2(4 * flip, -35), Vector2(15 * flip, -34), black, 2)
	# Rotation visual
	if rotate_pose:
		draw_arc(Vector2(0, 4), 58, 0.2, 5.5, 40, Color(1.0, 0.9, 0.1, 0.8), 4)
	# State label
	draw_string(ThemeDB.fallback_font, Vector2(-70, -90), state + (" / " + attack_name if attack_name != "" and state == "attack" else ""), HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color.WHITE)

func draw_ellipse(rect: Rect2, color: Color) -> void:
	# Cheap ellipse using polygon points.
	var pts := PackedVector2Array()
	for i in range(32):
		var a := TAU * i / 32.0
		pts.append(rect.position + rect.size / 2 + Vector2(cos(a) * rect.size.x / 2, sin(a) * rect.size.y / 2))
	draw_colored_polygon(pts, color)
