from database import supabase


def get_recycling_info(class_name: str, is_dirty: bool) -> dict | None:
    """
    guide_rules 테이블에서 class_name에 해당하는 분리배출 정보를 조회합니다.
    알 수 없는 class_name이면 None을 반환합니다.
    """
    response = (
        supabase
        .table("guide_rules")
        .select("*")
        .eq("class_name", class_name)
        .execute()
    )

    if not response.data:
        return None

    guide = response.data[0]

    result = {
        "class_name": guide["class_name"],
        "korean_name": guide["title"],
        "bin_color": "분리수거함 확인 필요",
        "disposal_steps": [guide["guide_text"]],
        "notes": guide["guide_text"],
        "dirty_warning": "오염된 경우 세척 후 배출하거나 일반쓰레기로 처리해야 할 수 있습니다." if is_dirty else None,
    }
    return result


def get_all_categories() -> list[dict]:
    """
    guide_rules 테이블의 전체 분류 목록을 반환합니다.
    """
    response = (
        supabase
        .table("guide_rules")
        .select("class_name, title")
        .execute()
    )

    if not response.data:
        return []

    return [
        {
            "class_name": item["class_name"],
            "korean_name": item["title"]
        }
        for item in response.data
    ]